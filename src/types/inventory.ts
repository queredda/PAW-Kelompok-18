 interface InventoryItem {
  id: string
  name: string
  category: string
  location: string
  quantity: number
  image: string
  status: 'Available' | 'Borrowed'
}

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

interface NavbarProps {
  menu: string;
  path: string;
}

export type { NavbarProps, InventoryItem, BorrowedItem, InventoryStats, BorrowedStats };
