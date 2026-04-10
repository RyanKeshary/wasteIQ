/**
 * WasteIQ — NextAuth v5 Configuration
 * Credentials provider (email+password) for Admin/Driver.
 * Google OAuth for Citizens.
 * Role-based session augmentation.
 */
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      avatar: string | null;
    };
  }

  interface User {
    role: string;
    avatar: string | null;
  }
}

declare module 'next-auth' {
  interface JWT {
    id: string;
    role: string;
    avatar: string | null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    /**
     * Credentials — Admin / Driver / Citizen email+password login.
     * Validates against bcryptjs-hashed passwords in the User table.
     */
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email ?? '',
          name: user.name,
          role: user.role,
          avatar: user.avatar,
        };
      },
    }),

    /**
     * Google OAuth — Citizens only.
     * Auto-creates Citizen record on first login.
     */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    /**
     * signIn — handle Google OAuth auto-registration.
     */
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        const existing = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existing) {
          // Auto-register as CITIZEN
          const newUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || 'Citizen',
              role: 'CITIZEN',
              avatar: user.image || null,
            },
          });

          // Create associated citizen record
          await prisma.citizen.create({
            data: { userId: newUser.id },
          });

          user.id = newUser.id;
          (user as any).role = 'CITIZEN';
          (user as any).avatar = user.image || null;
        } else {
          user.id = existing.id;
          (user as any).role = existing.role;
          (user as any).avatar = existing.avatar;
        }
      }
      return true;
    },

    /**
     * jwt — inject role + id into the token for middleware.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = (user as any).role;
        token.avatar = (user as any).avatar;
      }
      return token;
    },

    /**
     * session — expose role + id to the client.
     */
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.avatar = token.avatar as string | null;
      return session;
    },
  },
});
