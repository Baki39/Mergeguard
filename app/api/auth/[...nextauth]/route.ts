// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        
        // Get full user with organization
        const fullUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            organizations: {
              include: {
                organization: true,
              },
            },
          },
        });
        
        if (fullUser) {
          session.user.name = fullUser.name || user.name;
          session.user.email = user.email;
          
          // Default to first organization
          if (fullUser.organizations.length > 0) {
            session.user.organizationId = fullUser.organizations[0].organization.id;
          }
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        
        if (!existingUser) {
          // Create new user with default organization
          const newUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name,
              avatarUrl: user.image,
              githubId: account.providerAccountId,
              // Create default organization
              organizations: {
                create: {
                  organization: {
                    create: {
                      name: user.name || "My Organization",
                      slug: user.email?.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "") || "org",
                      plan: "FREE",
                      scoreThreshold: 95,
                      blockOnFail: true,
                    },
                  },
                  role: "OWNER",
                },
              },
            },
          });
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "database",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
