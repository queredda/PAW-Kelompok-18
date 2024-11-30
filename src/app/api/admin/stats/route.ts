import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getModels } from '@/lib/models';
import { getToken } from 'next-auth/jwt';
import { LoanRequest, RequestStatus } from '@/types/request';

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

    // Get all loan requests
    const loanRequests = await LoanRequestModel.find() as unknown as LoanRequest[];
    
    // Calculate borrowed items (using 'Delivered' status)
    const totalItemDipinjam = loanRequests
      .filter(request => request.status === 'Delivered')
      .reduce((acc, request) => acc + (request.kuantitas || 0), 0);

    // Calculate damaged items (using 'Canceled' status with 'rusak' condition)
    const totalItemRusak = loanRequests
      .filter(request => 
        request.status === 'Canceled' && 
        request.returnedCondition === 'rusak'
      )
      .reduce((acc, request) => acc + (request.kuantitas || 0), 0);

    // Calculate good condition items
    const totalItemBaik = totalItem - totalItemDipinjam - totalItemRusak;

    // Get pending requests
    const totalPermintaanPeminjaman = await LoanRequestModel.countDocuments({
      status: 'Proses' as RequestStatus
    });

    // Debug: Log the calculations
    console.log('Debug calculations:', {
      totalItem,
      totalItemBaik,
      totalItemRusak,
      totalItemDipinjam,
      totalPermintaanPeminjaman,
      allRequests: loanRequests.length,
      requestStatuses: [...new Set(loanRequests.map(req => req.status))],
      damagedItems: loanRequests.filter(req => 
        req.status === 'Canceled' && 
        req.returnedCondition === 'rusak'
      )
    });

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