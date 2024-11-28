// stats-cards.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Stats } from '@/types/inventory';

interface StatsCardsProps {
  stats: Stats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4 md:px-8">
      <Card className="bg-white/10 border-white/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-Text-A">Total Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-Text-A">{stats.totalItems}</div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 border-white/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-Text-A">Available Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-Text-A">{stats.availableItems}</div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 border-white/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-Text-A">Borrowed Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-Text-A">{stats.borrowedItems}</div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 border-white/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-Text-A">Total Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-Text-A">{stats.totalRequests}</div>
        </CardContent>
      </Card>
    </div>
  );
}