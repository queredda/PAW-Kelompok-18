import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
            {
              email: credentials?.email,
              password: credentials?.password,
            }
          );

          if (response.data) {
            return {
              id: response.data.id,
              email: credentials?.email,
              name: response.data.name,
              image: response.data.profilePic,
              accessToken: response.data.token,
            };
          }
          return null;
        } catch (error) {
          console.error('Login error:', error);
          return null;
        }
      }
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/error',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT, user: { accessToken: string } }) {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }: { session: Session, token: JWT }) {
      if (typeof token.accessToken === 'string') {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
};

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
