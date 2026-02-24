// app/dashboard/team/page.tsx
import { getCurrentOrganization, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { 
  Users, 
  Plus, 
  Crown,
  Shield,
  User,
  Mail,
  MoreVertical,
  Trash2
} from "lucide-react";

export default async function TeamPage() {
  const organization = await getCurrentOrganization();

  if (!organization) {
    return <div>Organization not found</div>;
  }

  const members = organization.members || [];
  const owner = members.find((m: any) => m.role === "OWNER") || { user: organization.owner };

  const roleColors: Record<string, string> = {
    OWNER: "bg-purple-100 text-purple-700",
    ADMIN: "bg-blue-100 text-blue-700",
    DEVELOPER: "bg-emerald-100 text-emerald-700",
    VIEWER: "bg-gray-100 text-gray-700",
  };

  const roleLabels: Record<string, string> = {
    OWNER: "Owner",
    ADMIN: "Admin",
    DEVELOPER: "Developer",
    VIEWER: "Viewer",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-500">Manage team members and roles</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
          <Plus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {members.map((member: any) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {member.user.avatarUrl ? (
                      <img src={member.user.avatarUrl} alt="" className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{member.user.name || "Unknown"}</p>
                      <p className="text-sm text-gray-500">{member.user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleColors[member.role]}`}>
                    {roleLabels[member.role]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {member.user.createdAt ? new Date(member.user.createdAt).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-6 py-4">
                  {member.role !== "OWNER" && (
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Permissions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Role Permissions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-gray-900">Owner</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Full access</li>
              <li>• Manage billing</li>
              <li>• Delete organization</li>
            </ul>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-gray-900">Admin</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Manage projects</li>
              <li>• Manage team</li>
              <li>• View billing</li>
            </ul>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-gray-900">Developer</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• View projects</li>
              <li>• Run verifications</li>
              <li>• View reports</li>
            </ul>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">Viewer</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• View reports</li>
              <li>• View settings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
