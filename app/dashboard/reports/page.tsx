// app/dashboard/reports/page.tsx
import { getCurrentOrganization } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { 
  FileText, 
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: { status?: string; project?: string };
}) {
  const organization = await getCurrentOrganization();

  if (!organization) {
    return <div>Organization not found</div>;
  }

  // Build where clause
  const where: any = {
    project: { organizationId: organization.id },
  };

  if (searchParams.status) {
    where.status = searchParams.status.toUpperCase();
  }

  if (searchParams.project) {
    where.projectId = searchParams.project;
  }

  const [reports, projects, stats] = await Promise.all([
    prisma.report.findMany({
      where,
      include: {
        project: true,
        securityIssues: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.project.findMany({
      where: { organizationId: organization.id },
      select: { id: true, name: true },
    }),
    prisma.report.groupBy({
      by: ["status"],
      where: { project: { organizationId: organization.id } },
      _count: true,
    }),
  ]);

  const statusCounts = stats.reduce((acc, s) => {
    acc[s.status] = s._count;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500">View all verification results</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          
          <div className="flex gap-2">
            <Link
              href="/dashboard/reports"
              className={`px-3 py-1.5 text-sm rounded-lg ${
                !searchParams.status 
                  ? "bg-emerald-100 text-emerald-700" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All ({reports.length})
            </Link>
            <Link
              href="/dashboard/reports?status=passed"
              className={`px-3 py-1.5 text-sm rounded-lg ${
                searchParams.status === "passed" 
                  ? "bg-emerald-100 text-emerald-700" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Passed ({statusCounts.PASSED || 0})
            </Link>
            <Link
              href="/dashboard/reports?status=failed"
              className={`px-3 py-1.5 text-sm rounded-lg ${
                searchParams.status === "failed" 
                  ? "bg-red-100 text-red-700" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Failed ({statusCounts.FAILED || 0})
            </Link>
            <Link
              href="/dashboard/reports?status=processing"
              className={`px-3 py-1.5 text-sm rounded-lg ${
                searchParams.status === "processing" 
                  ? "bg-yellow-100 text-yellow-700" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Processing ({statusCounts.PROCESSING || 0})
            </Link>
          </div>
        </div>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No reports found</h3>
          <p className="text-gray-500 mt-1">
            {searchParams.status ? "No reports match this filter" : "Connect a project to start receiving verifications"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issues</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{report.project.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={report.prUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      #{report.prNumber}
                    </a>
                    {report.prTitle && (
                      <p className="text-sm text-gray-500 truncate max-w-xs">{report.prTitle}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-lg font-bold ${
                      report.score >= 95 ? "text-emerald-600" : 
                      report.score >= 70 ? "text-yellow-600" : "text-red-600"
                    }`}>
                      {report.score}
                    </span>
                    <span className="text-gray-400">/100</span>
                  </td>
                  <td className="px-6 py-4">
                    {report.status === "PASSED" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                        <CheckCircle className="w-3 h-3" /> Passed
                      </span>
                    )}
                    {report.status === "FAILED" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        <XCircle className="w-3 h-3" /> Failed
                      </span>
                    )}
                    {report.status === "PROCESSING" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        <Clock className="w-3 h-3" /> Processing
                      </span>
                    )}
                    {report.status === "PENDING" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                    {report.status === "ERROR" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        <AlertTriangle className="w-3 h-3" /> Error
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {report.securityIssues.length > 0 ? (
                      <span className="text-red-600 font-medium">
                        {report.securityIssues.length} issues
                      </span>
                    ) : (
                      <span className="text-gray-500">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {report.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/reports/${report.id}`}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
