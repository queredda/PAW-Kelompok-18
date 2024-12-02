// page.tsx
'use client';

import { BackgroundBlur } from '@/components/background-blur';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { LoanStatus, ReturnCondition } from '@prisma/client';

interface StatsData {
  totalItem: number;
  totalItemBaik: number;
  totalItemRusak: number;
  totalItemDipinjam: number;
  recentRequests: {
    id: string;
    requestNumber: string;
    name: string;
    kuantitas: number;
    status: LoanStatus;
    isReturned: boolean;
    returnedCondition: ReturnCondition | null;
    imageUrl: string | null;
    createdAt: string;
    account: {
      username: string;
    };
  }[];
}

export default function DashboardPage() {
  const { status } = useSession();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (status !== 'authenticated') return;

      try {
        const response = await axios.get('/api/admin/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [status]);

  if (loading) {
    return (
      <div className="relative space-y-4 sm:space-y-6 md:space-y-8 w-full min-h-screen bg-Background-A p-4">
        <BackgroundBlur />
        <Skeleton className="h-6 sm:h-7 md:h-8 w-48 sm:w-56 md:w-64 mx-auto bg-white/10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_, idx) => (
            <Skeleton key={idx} className="h-24 sm:h-28 md:h-32 w-full bg-white/10" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative space-y-4 sm:space-y-6 md:space-y-8 w-full min-h-screen bg-Background-A p-4">
        <BackgroundBlur />
        <div className="text-center text-red-500 text-sm sm:text-base md:text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="relative space-y-4 sm:space-y-6 md:space-y-8 w-full min-h-screen bg-Background-A p-4">
      <BackgroundBlur />
      <h1 className="text-xl sm:text-2xl font-bold text-Text-A text-center pt-4 sm:pt-6 md:pt-8">
        Inventory Statistics
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white/10 p-3 sm:p-4 rounded-lg">
          <h2 className="text-base sm:text-lg font-semibold text-Text-A">Total Items</h2>
          <p className="text-2xl sm:text-3xl font-bold text-Text-A">
            {stats?.totalItem || 0}
          </p>
        </div>
        <div className="bg-white/10 p-3 sm:p-4 rounded-lg">
          <h2 className="text-base sm:text-lg font-semibold text-Text-A">Good Condition</h2>
          <p className="text-2xl sm:text-3xl font-bold text-Text-A">
            {stats?.totalItemBaik || 0}
          </p>
        </div>
        <div className="bg-white/10 p-3 sm:p-4 rounded-lg">
          <h2 className="text-base sm:text-lg font-semibold text-Text-A">Bad Condition</h2>
          <p className="text-2xl sm:text-3xl font-bold text-Text-A">
            {stats?.totalItemRusak || 0}
          </p>
        </div>
        <div className="bg-white/10 p-3 sm:p-4 rounded-lg">
          <h2 className="text-base sm:text-lg font-semibold text-Text-A">Borrowed Items</h2>
          <p className="text-2xl sm:text-3xl font-bold text-Text-A">
            {stats?.totalItemDipinjam || 0}
          </p>
        </div>
      </div>
      {stats?.recentRequests && stats.recentRequests.length > 0 && (
        <div className="p-2 sm:p-3 md:p-4">
          <h2 className="text-lg sm:text-xl font-semibold text-Text-A mb-3 sm:mb-4">
            Recent Requests
          </h2>
          <div className="bg-white/10 rounded-lg overflow-x-auto">
            <table className="w-full text-Text-A text-sm sm:text-base">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-2 sm:p-3 text-left">Request Number</th>
                  <th className="p-2 sm:p-3 text-left">Item</th>
                  <th className="p-2 sm:p-3 text-left">User</th>
                  <th className="p-2 sm:p-3 text-left">Quantity</th>
                  <th className="p-2 sm:p-3 text-left">Status</th>
                  <th className="p-2 sm:p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentRequests.map((request) => (
                  <tr key={request.id} className="border-t border-white/10">
                    <td className="p-2 sm:p-3 whitespace-nowrap">{request.requestNumber}</td>
                    <td className="p-2 sm:p-3 whitespace-nowrap">{request.name}</td>
                    <td className="p-2 sm:p-3 whitespace-nowrap">{request.account.username}</td>
                    <td className="p-2 sm:p-3 whitespace-nowrap">{request.kuantitas}</td>
                    <td className="p-2 sm:p-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs sm:text-sm ${
                          request.status === 'PROSES'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : request.status === 'DELIVERED'
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3 whitespace-nowrap">
                      {new Date(request.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
