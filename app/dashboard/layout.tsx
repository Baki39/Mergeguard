import { getCurrentOrganization, getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Shield, 
  LayoutDashboard, 
  GitBranch, 
  FileText, 
  Settings, 
  CreditCard,
  Users,
  Bell,
  LogOut,
  ChevronDown
} from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const organization = await getCurrentOrganization();

  if (!user) {
    redirect("/api/auth/signin");
  }

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/projects", icon: GitBranch, label: "Projects" },
    { href: "/dashboard/reports", icon: FileText, label: "Reports" },
    { href: "/dashboard/team", icon: Users, label: "Team" },
    { href: "/dashboard/billing", icon: CreditCard, label: "Billing" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">MergeGuard</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Organization Switcher */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <span className="font-medium">{organization?.name || "Select Org"}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {/* Organization Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="p-2">
                  {user.organizations?.map((org: any) => (
                    <Link
                      key={org.organization.id}
                      href={`/dashboard?org=${org.organization.id}`}
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      {org.organization.name}
                    </Link>
                  ))}
                  <hr className="my-2" />
                  <Link
                    href="/dashboard/settings/organizations"
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    + New Organization
                  </Link>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name || ""} className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </span>
                </div>
              )}
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user.name || "User"}</p>
                <p className="text-xs text-gray-500">{organization?.plan || "Free"} Plan</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)]">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Usage Stats */}
          <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-500 mb-2">Monthly Usage</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Verifications</span>
                  <span className="font-medium">{organization?.monthlyVerifications || 0} / {getPlanLimit(organization?.plan || "FREE").verifications}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(((organization?.monthlyVerifications || 0) / getPlanLimit(organization?.plan || "FREE").verifications) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
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
