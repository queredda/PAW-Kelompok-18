interface InventoryItem {
  id: string
  name: string
  kategori: string
  kondisi: string
  kuantitas: number
  imageUrl: string
  status: 'Available' | 'Borrowed'
}

//  interface BorrowedItem {
//   _id: string,
//   inventoryId: string,
//   userId: string,
//   name: string,
//   kuantitas: number,
//   status: "Delivered",
//   isReturned: boolean,
//   returnedCondition: "baik",
//   loanId: 4,
//   __v: 0, 
//   namaUser: "Anonymous"
// }

interface BorrowedItem {
  trackingId: string
  product: {
    name: string
    image: string
  }
  customer: string
  date: string
  amount: number
  status: string
}

interface InventoryStats {
  totalItems: number
  goodCondition: number
  badCondition: number
}

interface BorrowedStats {
  totalRequests: number
  totalBorrowed: number
  totalReturned: number
}

interface Stats {
  totalItems: number;
  availableItems: number;
  borrowedItems: number;
  totalUsers: number;
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
}

interface NavbarProps {
  menu: string;
  path: string;
}

export type { NavbarProps, InventoryItem, BorrowedItem, InventoryStats, BorrowedStats, Stats };
