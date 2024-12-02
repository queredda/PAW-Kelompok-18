'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    if (requireAdmin && session.user?.role !== 'ADMIN') {
      router.push('/login');
    }
  }, [session, status, router, requireAdmin]);

  if (status === 'loading') {
    return (
      <div className="w-full min-h-screen bg-Background-A p-4">
        <Skeleton className="h-8 w-64 mx-auto bg-white/10" />
        <div className="space-y-4 mt-8">
          {[...Array(5)].map((_, idx) => (
            <Skeleton key={idx} className="h-16 w-full bg-white/10" />
          ))}
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 