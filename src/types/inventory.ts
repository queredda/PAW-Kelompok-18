import { InventoryStatus, ItemCondition } from '@prisma/client';

export interface InventoryItem {
  id: string;
  name: string;
  kategori: string;
  totalKuantitas: number;
  imageUrl?: string | null;
  status: InventoryStatus;
  kondisi: ItemCondition;
  totalItemRusak: number;
  totalItemBaik: number;
  totalItemDipinjam: number;
  createdAt: string;
  updatedAt: string;
}

interface SeparatedInventoryItem {
  id: string
  name: string
  kondisi: ItemCondition
  kuantitas: number
  status: InventoryStatus
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

export type { NavbarProps, BorrowedItem, InventoryStats, BorrowedStats, Stats, SeparatedInventoryItem };
