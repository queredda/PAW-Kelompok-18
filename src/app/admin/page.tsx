import { StatsCards } from "@/components/stats-cards"
import type { InventoryStats, BorrowedStats } from "@/types/inventory"

const mockInventoryStats: InventoryStats = {
  totalItems: 1000,
  goodCondition: 888,
  badCondition: 112,
}

const mockBorrowedStats: BorrowedStats = {
  totalRequests: 14,
  totalBorrowed: 110,
  totalReturned: 22
}

export default function DashboardPage() {
  return (
    <div className="space-y-8 w-full min-h-screen bg-Background-A ">
      <h1 className="text-2xl font-bold text-Text-A text-center mb-6">Stats of Inventory</h1>
      <StatsCards stats={mockInventoryStats} />
      <h1 className="text-2xl font-bold text-Text-A text-center mb-6">Stats of Borrowed Items</h1>
      <StatsCards stats={mockBorrowedStats} />
    </div>
  )
}
