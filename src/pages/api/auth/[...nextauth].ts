import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/mongodb";
import { UserModel } from "@/models/User";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      googleId?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectDB();
          
          const existingUser = await UserModel.findOne({ email: user.email });
          
          if (!existingUser) {
            await UserModel.create({
              googleId: account.providerAccountId,
              name: user.name,
              email: user.email,
              profilePictureUrl: user.image,
            });
          }
          
          return true;
        } catch (error) {
          console.error("Error saving user:", error);
          return false;
        }
      }
      return true;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async session({ session, token }) {
      if (session?.user) {
        try {
          await connectDB();
          const dbUser = await UserModel.findOne({ email: session.user.email });
          
          if (dbUser) {
            session.user.id = dbUser._id.toString();
            session.user.googleId = dbUser.googleId;
          }
        } catch (error) {
          console.error("Error in session callback:", error);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET!,
};

export default NextAuth(authOptions);