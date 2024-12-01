import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

console.log('Auth route initialized with URL:', process.env.NEXTAUTH_URL);
console.log('Environment:', process.env.NODE_ENV);

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
