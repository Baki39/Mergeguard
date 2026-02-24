// lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  
  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      organizations: {
        include: {
          organization: {
            include: {
              projects: {
                take: 10,
                orderBy: { createdAt: "desc" },
              },
              members: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return user;
}

export async function getCurrentOrganization() {
  const user = await getCurrentUser();
  
  if (!user) {
    return null;
  }

  // Get organization from session or default to first
  const orgId = (user as any).organizationId || user.organizations[0]?.organization.id;
  
  if (!orgId) {
    return null;
  }

  return await prisma.organization.findUnique({
    where: { id: orgId },
    include: {
      projects: {
        orderBy: { createdAt: "desc" },
      },
      members: {
        include: {
          user: true,
        },
      },
      owner: true,
    },
  });
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("Unauthorized");
  }
  
  return user;
}

export async function requireOrganization() {
  const org = await getCurrentOrganization();
  
  if (!org) {
    throw new Error("Organization not found");
  }
  
  return org;
}
