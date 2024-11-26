import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          const response = await axios.post(
            `${process.env.BACKEND_URL}/auth/login`,
            {
              email: user.email,
              name: user.name, 
              profilePic: user.image,
              googleId: profile?.sub,
            },
            {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              withCredentials: true
            }
          );
          
          if (response.data.message === "Logged in successfully") {
            const cookies = response.headers['set-cookie'];
            if (!cookies) {
              console.error('No cookies received from backend');
              return false;
            }

            const jwtCookie = cookies.find(cookie => cookie.startsWith('jwt='));
            if (!jwtCookie) {
              console.error('JWT cookie not found in response');
              return false;
            }

            const jwt = jwtCookie.split(';')[0].split('=')[1];
            account.access_token = jwt;
            return true;
          }
          return false;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error('Google sign in failed:', error.response?.data || error.message);
          } else {
            console.error('Unexpected error during sign in:', error);
          }
          return false;
        }
      }
      return true;
    },
    
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
});

export { handler as GET, handler as POST };
