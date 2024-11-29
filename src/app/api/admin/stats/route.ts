import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getModels } from '@/lib/models';
import { getToken } from 'next-auth/jwt';
import { inventorySeparator } from '@/lib/inventory-utils';
import { SeparatedInventoryItem } from '@/types/inventory';

export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    const token = await getToken({ req });
    if (!token?.sub || token.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    await connectDB();
    const { InventoryModel, LoanRequestModel } = getModels();

    // Get all inventories
    const allInventories = await InventoryModel.find();
    const totalItem = allInventories.reduce(
      (acc, inventory) => acc + inventory.totalKuantitas,
      0
    );

    // Process separated inventories
    const separatedInventories: SeparatedInventoryItem[] = [];
    for (const inventory of allInventories) {
      const separatedInventory = await inventorySeparator(inventory.id);
      separatedInventories.push(...separatedInventory);
    }

    // Calculate statistics
    const totalItemBaik = separatedInventories
      .filter(item => item.kondisi === 'baik')
      .reduce((acc, item) => acc + item.kuantitas, 0);

    const totalItemRusak = separatedInventories
      .filter(item => item.kondisi === 'rusak')
      .reduce((acc, item) => acc + item.kuantitas, 0);

    const totalItemDipinjam = separatedInventories
      .filter(item => item.status === 'Borrowed')
      .reduce((acc, item) => acc + item.kuantitas, 0);

    // Get pending loan requests
    const loanRequests = await LoanRequestModel.find({ status: 'Proses' });
    const totalPermintaanPeminjaman = loanRequests.length;

    return NextResponse.json({
      totalItem,
      totalItemBaik,
      totalItemRusak,
      totalItemDipinjam,
      totalPermintaanPeminjaman,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}