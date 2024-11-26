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
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
            {
              email: user.email,
              name: user.name, 
              profilePic: user.image,
              googleId: profile?.sub,
            },
            {
              withCredentials: true
            }
          );
          
          if (response.data.message === "Logged in successfully") {
            // Store the JWT token from cookies
            const cookies = response.headers['set-cookie'];
            if (cookies) {
              const jwtCookie = cookies.find(cookie => cookie.startsWith('jwt='));
              if (jwtCookie) {
                const jwt = jwtCookie.split(';')[0].split('=')[1];
                account.access_token = jwt;
                console.log('JWT Token:', jwt);
              }
            }
          }
          
          return true;
        } catch (error) {
          console.error('Error during Google sign in:', error);
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
    }
  }
});

export { handler as GET, handler as POST };
