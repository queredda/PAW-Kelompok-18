import { Role, Status } from '@prisma/client';
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      role: Role;
      status: Status;
    }
  }

  interface User {
    id: string;
    username: string;
    email: string;
    role: Role;
    status: Status;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
    email: string;
    role: Role;
    status: Status;
  }
}
