import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthController } from '@/controllers/auth';
import connectDB from '@/lib/db';
import bcrypt from 'bcryptjs';

// Rate limiting setup
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

interface AttemptInfo {
  attempts: number;
  lastAttempt: number;
}

const loginAttempts: Map<string, AttemptInfo> = new Map();

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 1 * 60 * 60, // 1 hours
  },
  jwt: {
    maxAge: 1 * 60 * 60, // 1 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role as "user" | "admin";
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as string,
        },
      };
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Rate limiting logic
        const attemptInfo = loginAttempts.get(credentials.email) || {
          attempts: 0,
          lastAttempt: Date.now(),
        };
        const timeSinceLastAttempt = Date.now() - attemptInfo.lastAttempt;

        if (
          attemptInfo.attempts >= MAX_ATTEMPTS &&
          timeSinceLastAttempt < BLOCK_DURATION
        ) {
          // Too many attempts, deny access
          throw new Error('Too many login attempts. Please try again later.');
        }

        if (timeSinceLastAttempt > BLOCK_DURATION) {
          // Reset attempts after block duration
          attemptInfo.attempts = 0;
        }

        attemptInfo.attempts += 1;
        attemptInfo.lastAttempt = Date.now();
        loginAttempts.set(credentials.email, attemptInfo);

        try {
          await connectDB();

          const user = await AuthController.findUserByEmail(credentials.email);
          
          if (!user) {
            return null;
          }

          const isValidPassword = await bcrypt.compare(credentials.password, user.password);

          if (!isValidPassword) {
            return null;
          }

          // Successful login, reset attempts
          loginAttempts.delete(credentials.email);

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
  },
  debug: process.env.NODE_ENV === 'development',
};