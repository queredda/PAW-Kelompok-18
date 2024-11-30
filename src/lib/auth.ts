import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { getModels } from '@/lib/models';
import connectDB from '@/lib/db';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials');
            throw new Error('Missing credentials');
          }

          await connectDB();
          const { UserModel } = getModels();
          
          console.log('Searching for user:', credentials.email);
          const user = await UserModel.findOne({ email: credentials.email });

          if (!user) {
            console.log('No user found with email:', credentials.email);
            throw new Error('No user found');
          }

          const isValid = await compare(credentials.password, user.password);
          console.log('Password validation:', isValid);

          if (!isValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as 'user' | 'admin'
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'user' | 'admin';
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};