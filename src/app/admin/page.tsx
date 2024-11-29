// page.tsx
'use client';
import { StatsCards } from '@/components/stats-cards';
import { BackgroundBlur } from '@/components/background-blur';
import { Skeleton } from '@/components/ui/skeleton';
import { useStats } from '@/hooks/useStats';

export default function DashboardPage() {
  const { stats, loading, error } = useStats();

  if (loading) {
    return (
      <div className="relative space-y-8 w-full min-h-screen bg-Background-A">
        <BackgroundBlur />
        <Skeleton className="h-8 w-64 mx-auto bg-white/10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {[...Array(4)].map((_, idx) => (
            <Skeleton key={idx} className="h-32 w-full bg-white/10" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative space-y-8 w-full min-h-screen bg-Background-A">
        <BackgroundBlur />
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="relative space-y-8 w-full min-h-screen bg-Background-A">
      <BackgroundBlur />
      <h1 className="text-2xl font-bold text-Text-A text-center mb-6">
        Inventory Statistics
      </h1>
      {stats && <StatsCards stats={stats} />}
    </div>
  );
}
