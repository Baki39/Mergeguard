// app/dashboard/projects/page.tsx
import { getCurrentOrganization } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { 
  GitBranch, 
  Plus, 
  Settings, 
  Trash2,
  ExternalLink,
  Shield,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default async function ProjectsPage() {
  const organization = await getCurrentOrganization();

  if (!organization) {
    return <div>Organization not found</div>;
  }

  const projects = await prisma.project.findMany({
    where: { organizationId: organization.id },
    include: {
      _count: {
        select: { reports: true },
      },
      reports: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500">Manage your connected repositories</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </Link>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <GitBranch className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No projects yet</h3>
          <p className="text-gray-500 mt-1">Connect a GitHub repository to get started</p>
          <Link
            href="/dashboard/projects/new"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" />
            Add Your First Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => {
            const lastReport = project.reports[0];
            const passRate = project._count.reports > 0 
              ? Math.round((project.reports.filter(r => r.status === "PASSED").length / project._count.reports) * 100)
              : null;

            return (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <GitBranch className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-500">{project.githubOwner}/{project.githubRepo}</p>
                    </div>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Verifications</span>
                    <span className="font-medium">{project._count.reports}</span>
                  </div>
                  
                  {passRate !== null && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Pass Rate</span>
                      <span className={`font-medium ${passRate >= 90 ? "text-emerald-600" : passRate >= 70 ? "text-yellow-600" : "text-red-600"}`}>
                        {passRate}%
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Threshold</span>
                    <span className="font-medium">{project.scoreThreshold}%</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Auto-scan</span>
                    <span className={`font-medium ${project.autoScan ? "text-emerald-600" : "text-gray-600"}`}>
                      {project.autoScan ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>

                {lastReport && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Last check</span>
                      <span className={`font-medium ${
                        lastReport.status === "PASSED" ? "text-emerald-600" : 
                        lastReport.status === "FAILED" ? "text-red-600" : "text-gray-600"
                      }`}>
                        {lastReport.score}/100
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <Shield className="w-4 h-4" />
                    View
                  </Link>
                  <a
                    href={`https://github.com/${project.githubOwner}/${project.githubRepo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-2 text-gray-500 hover:text-gray-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Usage Warning */}
      {organization.plan === "FREE" && projects.length >= 1 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Free Plan Limitation</p>
            <p className="text-sm text-yellow-700 mt-1">
              You can only add 1 project on the Free plan. 
              <Link href="/dashboard/billing" className="underline font-medium">Upgrade to add more</Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
