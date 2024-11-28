// stats-cards.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Stats } from '@/types/inventory';

interface StatsCardsProps {
  stats: Stats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-5 px-[40px] md:px-0">
      <Card className="bg-pink-400/90 text-Text-A">
        <CardHeader className="pb-2">
          <CardTitle className="text-[16px] md:text-[18px] font-pop font-medium">
            Total Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-[48px] md:text-[60px] text-center font-bold">
            {stats.totalItem}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-pink-400/80 text-Text-A">
        <CardHeader className="pb-2">
          <CardTitle className="text-[16px] md:text-[18px] font-pop font-medium">
            Good Condition Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-[48px] md:text-[60px] text-center font-bold">
            {stats.totalItemBaik}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-pink-400/70 text-Text-A">
        <CardHeader className="pb-2">
          <CardTitle className="text-[16px] md:text-[18px] font-pop font-medium">
            Damaged Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-[48px] md:text-[60px] text-center font-bold">
            {stats.totalItemRusak}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-pink-400/60 text-Text-A">
        <CardHeader className="pb-2">
          <CardTitle className="text-[16px] md:text-[18px] font-pop font-medium">
            Items Borrowed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-[48px] md:text-[60px] text-center font-bold">
            {stats.totalItemDipinjam}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-pink-400/50 text-Text-A">
        <CardHeader className="pb-2">
          <CardTitle className="text-[16px] md:text-[18px] font-pop font-medium">
            Borrow Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-[48px] md:text-[60px] text-center font-bold">
            {stats.totalPermintaanPeminjaman}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}