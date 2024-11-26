import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { Account, Profile } from "next-auth";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/error',
  },
  callbacks: {
    async jwt({ token, account, profile }: { token: JWT, account: Account | null, profile?: Profile }) {
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
    async redirect({ url, baseUrl }: { url: string, baseUrl: string }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};

// Export handler using Next.js Route API
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
