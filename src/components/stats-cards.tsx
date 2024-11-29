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
          <div className="text-2xl font-bold text-Text-A">{stats.totalItem}</div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 border-white/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-Text-A">Good Condition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-Text-A">{stats.totalItemBaik}</div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 border-white/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-Text-A">Bad Condition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-Text-A">{stats.totalItemRusak}</div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 border-white/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-Text-A">Borrowed Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-Text-A">{stats.totalItemDipinjam}</div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 border-white/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-Text-A">Pending Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-Text-A">{stats.totalPermintaanPeminjaman}</div>
        </CardContent>
      </Card>
    </div>
  );
}