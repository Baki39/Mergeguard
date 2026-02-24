// app/dashboard/settings/page.tsx
import { getCurrentOrganization, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Key, 
  Globe,
  Save
} from "lucide-react";

export default async function SettingsPage() {
  const organization = await getCurrentOrganization();
  const user = await getCurrentUser();

  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account and organization settings</p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            <a href="#profile" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
              <User className="w-5 h-5" />
              Profile
            </a>
            <a href="#organization" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
              <Globe className="w-5 h-5" />
              Organization
            </a>
            <a href="#security" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
              <Shield className="w-5 h-5" />
              Security
            </a>
            <a href="#notifications" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
              <Bell className="w-5 h-5" />
              Notifications
            </a>
            <a href="#api" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
              <Key className="w-5 h-5" />
              API Keys
            </a>
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Section */}
          <div id="profile" className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="w-16 h-16 rounded-full" />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-medium text-gray-600">
                      {user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{user?.name || "User"}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                <input
                  type="text"
                  defaultValue={user?.name || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={user?.email || ""}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Email is managed by GitHub</p>
              </div>
            </div>
          </div>

          {/* Organization Section */}
          <div id="organization" className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                <input
                  type="text"
                  defaultValue={organization.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  defaultValue={organization.slug}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">https://mergeguard.ai/{organization.slug}</p>
              </div>

              <hr className="my-4" />

              <h3 className="font-medium text-gray-900">Verification Settings</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Score Threshold</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="50"
                    max="100"
                    defaultValue={organization.scoreThreshold}
                    className="flex-1"
                  />
                  <span className="text-lg font-medium text-gray-900">{organization.scoreThreshold}%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">PRs below this score will be blocked</p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="blockOnFail"
                  defaultChecked={organization.blockOnFail}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="blockOnFail" className="text-sm text-gray-700">
                  Block merge when verification fails
                </label>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div id="security" className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500 mb-3">Add extra security to your account</p>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Enable 2FA
                </button>
              </div>

              <hr className="my-4" />

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Connected Accounts</h3>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">GH</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">GitHub</p>
                      <p className="text-sm text-gray-500">Connected</p>
                    </div>
                  </div>
                  <button className="text-sm text-red-600 hover:text-red-700">
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div id="notifications" className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive email alerts for verifications</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-emerald-600" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Slack Notifications</p>
                  <p className="text-sm text-gray-500">Send alerts to Slack channel</p>
                </div>
                <input type="checkbox" className="w-5 h-5 text-emerald-600" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Failed Verifications</p>
                  <p className="text-sm text-gray-500">Alert when a PR fails verification</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-emerald-600" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Weekly Reports</p>
                  <p className="text-sm text-gray-500">Weekly summary of verifications</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* API Section */}
          <div id="api" className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">API Keys</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-3">Use API keys to integrate MergeGuard with your own tools</p>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Generate API Key
                </button>
              </div>

              <hr className="my-4" />

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Webhooks</h3>
                <p className="text-sm text-gray-500 mb-3">Receive events when verifications complete</p>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Add Webhook
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
