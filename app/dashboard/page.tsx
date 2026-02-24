// app/dashboard/page.tsx
import { getCurrentOrganization, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { 
  Shield, 
  GitPullRequest, 
  AlertTriangle, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const organization = await getCurrentOrganization();

  if (!organization) {
    return <div>Organization not found</div>;
  }

  // Get stats
  const [
    totalProjects,
    totalReports,
    recentReports,
    securityIssues,
    passedReports,
    failedReports,
  ] = await Promise.all([
    prisma.project.count({ where: { organizationId: organization.id } }),
    prisma.report.count({ where: { project: { organizationId: organization.id } } }),
    prisma.report.findMany({
      where: { project: { organizationId: organization.id } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { project: true },
    }),
    prisma.securityIssue.count({
      where: { report: { project: { organizationId: organization.id } } },
    }),
    prisma.report.count({
      where: { project: { organizationId: organization.id }, status: "PASSED" },
    }),
    prisma.report.count({
      where: { project: { organizationId: organization.id }, status: "FAILED" },
    }),
  ]);

  const passRate = totalReports > 0 ? Math.round((passedReports / totalReports) * 100) : 0;

  // Calculate trend (simplified)
  const thisWeekReports = await prisma.report.count({
    where: {
      project: { organizationId: organization.id },
      createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name || "User"}!</p>
        </div>
        <Link
          href="/dashboard/projects"
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Shield className="w-4 h-4" />
          Add Project
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Projects"
          value={totalProjects}
          icon={GitPullRequest}
          color="blue"
        />
        <StatCard
          title="Verifications"
          value={totalReports}
          icon={Shield}
          color="emerald"
        />
        <StatCard
          title="Pass Rate"
          value={`${passRate}%`}
          icon={TrendingUp}
          color={passRate >= 90 ? "emerald" : passRate >= 70 ? "yellow" : "red"}
          trend={passRate >= 90 ? "Good" : passRate >= 70 ? "Needs Work" : "Critical"}
        />
        <StatCard
          title="Security Issues"
          value={securityIssues}
          icon={AlertTriangle}
          color={securityIssues > 10 ? "red" : "yellow"}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Verifications</h2>
            <Link href="/dashboard/reports" className="text-sm text-emerald-600 hover:text-emerald-700">
              View all <ArrowRight className="w-4 h-4 inline" />
            </Link>
          </div>

          {recentReports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No verifications yet</p>
              <p className="text-sm">Connect a project to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {report.status === "PASSED" ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : report.status === "FAILED" ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : report.status === "PROCESSING" ? (
                      <Clock className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">#{report.prNumber} {report.prTitle || "Untitled"}</p>
                      <p className="text-sm text-gray-500">{report.project.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${report.score >= 95 ? "text-emerald-600" : "text-red-600"}`}>
                      {report.score}/100
                    </p>
                    <p className="text-xs text-gray-500">
                      {report.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Verifications</span>
              <span className="font-bold text-gray-900">{thisWeekReports}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Passed</span>
              <span className="font-bold text-emerald-600">{passedReports}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Failed</span>
              <span className="font-bold text-red-600">{failedReports}</span>
            </div>
            <hr className="my-4" />
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Plan</span>
              <span className="font-bold text-gray-900">{organization.plan}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Remaining</span>
              <span className="font-bold text-gray-900">
                {Math.max(0, getPlanLimit(organization.plan).verifications - organization.monthlyVerifications)}
              </span>
            </div>
          </div>

          <Link
            href="/dashboard/billing"
            className="mt-6 block w-full text-center py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Upgrade Plan
          </Link>
        </div>
      </div>

      {/* Getting Started (if no projects) */}
      {totalProjects === 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Get Started with MergeGuard</h3>
              <p className="text-gray-600 mt-1">
                Connect your first GitHub repository to start protecting your code.
              </p>
              <div className="mt-4 flex gap-3">
                <Link
                  href="/dashboard/projects/new"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Add Project
                </Link>
                <Link
                  href="/docs"
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Read Docs
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color,
  trend 
}: { 
  title: string; 
  value: string | number; 
  icon: any; 
  color: string;
  trend?: string;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${
              trend === "Good" ? "text-emerald-600" : 
              trend === "Needs Work" ? "text-yellow-600" : "text-red-600"
            }`}>
              {trend}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

function getPlanLimit(plan: string) {
  const limits: Record<string, { verifications: number; tokens: number; team: number }> = {
    FREE: { verifications: 10, tokens: 10000, team: 1 },
    PRO: { verifications: 300, tokens: 100000, team: 5 },
    TEAM: { verifications: 1000, tokens: 500000, team: 25 },
    ENTERPRISE: { verifications: 999999, tokens: 999999999, team: 999 },
  };
  return limits[plan] || limits.FREE;
}
