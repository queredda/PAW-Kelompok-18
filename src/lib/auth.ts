import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { PrismaClient, Role, Status } from '@prisma/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

const prisma = new PrismaClient();

declare module 'next-auth' {
  interface Session {
    user: User & {
      id: string;
      username: string;
      role: Role;
      status: Status;
    };
  }
  interface User {
    id: string;
    username: string;
    role: Role;
    status: Status;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 1 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          username: user.username,
          role: user.role,
          status: user.status || 'ACTIVE',
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          username: token.username as string,
          role: token.role as Role,
          status: token.status as Status,
        },
      };
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.password || (!credentials.email && !credentials.username)) {
            return null;
          }

          const user = await prisma.account.findFirst({
            where: {
              OR: [
                { email: credentials.email || credentials.username },
                { username: credentials.username || credentials.email },
              ],
            },
            select: {
              id: true,
              username: true,
              email: true,
              password: true,
              role: true,
              status: true,
            },
          });

          if (!user) {
            console.log('User not found');
            return null;
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            console.log('Invalid password');
            return null;
          }

          return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status as Status,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
};
