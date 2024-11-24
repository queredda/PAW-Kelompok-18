import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BorrowedStats, InventoryStats } from '@/types/inventory';

interface StatsCardsProps {
  stats: InventoryStats | BorrowedStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  if ('totalItems' in stats) {
    // Inventory Stats
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 px-[40px] md:px-0">
        <Card className="bg-pink-400/90 text-Text-A">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[16px] md:text-[18px] text-Text-A font-pop font-medium">
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[48px] md:text-[60px] text-Text-A text-center font-bold">
              {stats.totalItems}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-pink-400/80 text-Text-A">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[16px] md:text-[18px] text-Text-A text-center font-pop font-medium">
              Items in Good Condition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[48px] md:text-[60px] text-Text-A text-center font-bold">
              {stats.goodCondition}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-pink-400/70 text-Text-A">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[16px] md:text-[18px] text-Text-A font-pop font-medium">
              Items in Bad Condition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[48px] md:text-[60px] text-Text-A text-center font-bold">
              {stats.badCondition}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } else {
    // Borrowed Stats
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 px-[40px] md:px-0">
        <Card className="bg-pink-400/90 text-Text-A">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[16px] md:text-[18px] text-Text-A font-pop font-medium">
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[48px] md:text-[60px] text-Text-A text-center font-bold">
              {stats.totalRequests}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-pink-400/80 text-Text-A">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[16px] md:text-[18px] text-Text-A text-center font-pop font-medium">
              Total Borrowed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[48px] md:text-[60px] text-Text-A text-center font-bold">
              {stats.totalBorrowed}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-pink-400/70 text-Text-A">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[16px] md:text-[18px] text-Text-A font-pop font-medium">
              Total Returned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[48px] md:text-[60px] text-Text-A text-center font-bold">
              {stats.totalReturned}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
