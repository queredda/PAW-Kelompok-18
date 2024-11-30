interface InventoryItem {
  id: number
  name: string
  kategori: string
  kondisi: string
  status: string
  imageUrl: string
  totalKuantitas: number
  availableQuantity?: number
  damagedQuantity?: number
}

interface SeparatedInventoryItem {
  id: number
  name: string
  kondisi: string
  kuantitas: number
  status: string
  kategori: string
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

interface Stats {
  totalItem: number;
  totalItemBaik: number;
  totalItemRusak: number;
  totalItemDipinjam: number;
  totalPermintaanPeminjaman: number;
}

interface NavbarProps {
  menu: string;
  path: string;
}

export type { NavbarProps, InventoryItem, BorrowedItem, InventoryStats, BorrowedStats, Stats, SeparatedInventoryItem };
