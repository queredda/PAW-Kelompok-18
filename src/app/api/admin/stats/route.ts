import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import { LoanStatus, ReturnCondition, ItemCondition } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token?.sub || token.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Get all inventories and loan requests
    const [inventories, loanRequests] = await Promise.all([
      prisma.inventory.findMany(),
      prisma.loanRequest.findMany({
        where: {
          OR: [
            { returnedCondition: ReturnCondition.RUSAK },
            { status: LoanStatus.DELIVERED }
          ]
        }
      })
    ]);

    // Calculate statistics
    const totalItem = inventories.reduce(
      (acc, inv) => acc + inv.totalKuantitas,
      0
    );

    // Count items in bad condition from inventory
    const totalItemRusakFromInventory = inventories.filter(
      inv => inv.kondisi === ItemCondition.RUSAK
    ).reduce((acc, inv) => acc + inv.totalKuantitas, 0);

    // Count items returned in bad condition from loan requests
    const totalItemRusakFromReturns = loanRequests.filter(
      req => req.returnedCondition === ReturnCondition.RUSAK
    ).reduce((acc, req) => acc + req.kuantitas, 0);

    // Total damaged items is the sum from both sources
    const totalItemRusak = totalItemRusakFromInventory + totalItemRusakFromReturns;

    // Calculate borrowed items
    const totalItemDipinjam = loanRequests
      .filter(req => req.status === LoanStatus.DELIVERED)
      .reduce((acc, req) => acc + req.kuantitas, 0);

    // Calculate items in good condition
    const totalItemBaik = totalItem - totalItemRusak - totalItemDipinjam;

    // Get recent requests
    const recentRequests = await prisma.loanRequest.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        account: {
          select: {
            username: true
          }
        }
      }
    });

    return NextResponse.json({
      totalItem,
      totalItemBaik,
      totalItemRusak,
      totalItemDipinjam,
      recentRequests
    });
  } catch (error) {
    console.error('Fetch stats error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
