import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
      role?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
    accessToken?: string;
    role?: string;
  }
} 