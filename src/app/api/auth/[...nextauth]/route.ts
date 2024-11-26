import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/error', // Create this page if you haven't already
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`,
            {
              token: account.access_token,
              email: profile?.email,
              name: profile?.name,
            }
          );
          token.accessToken = response.data.token;
        } catch (error) {
          console.error('Error exchanging token:', error);
        }
      }
      return token;
    },
    async session({ session, token }: { session: Session, token: JWT }) {
      if (typeof token.accessToken === 'string') {
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
});

export { handler as GET, handler as POST };