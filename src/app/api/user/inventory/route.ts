import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import {
  ItemCondition,
  LoanStatus,
  ReturnCondition,
} from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token?.sub) {
      return NextResponse.json(
        { message: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    // Get all inventories and loan requests
    const [inventories, loanRequests] = await Promise.all([
      prisma.inventory.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.loanRequest.findMany({
        where: {
          OR: [
            { returnedCondition: ReturnCondition.RUSAK },
            { status: LoanStatus.DELIVERED },
          ],
        },
      }),
    ]);

    // Calculate statistics for each inventory item
    const inventoryWithStats = inventories.map((inventory) => {
      // Count damaged items from loan returns
      const damagedFromReturns = loanRequests
        .filter(
          (req) =>
            req.inventoryId === inventory.id &&
            req.returnedCondition === ReturnCondition.RUSAK
        )
        .reduce((acc, req) => acc + req.kuantitas, 0);

      // Count borrowed items
      const borrowedItems = loanRequests
        .filter(
          (req) =>
            req.inventoryId === inventory.id &&
            req.status === LoanStatus.DELIVERED
        )
        .reduce((acc, req) => acc + req.kuantitas, 0);

      // Calculate total damaged items (from inventory + returns)
      const totalItemRusak =
        (inventory.kondisi === ItemCondition.RUSAK
          ? inventory.totalKuantitas
          : 0) + damagedFromReturns;

      // Calculate items in good condition
      const totalItemBaik =
        inventory.totalKuantitas - totalItemRusak - borrowedItems;

      return {
        ...inventory,
        totalItemRusak,
        totalItemBaik,
        totalItemDipinjam: borrowedItems,
      };
    });

    return NextResponse.json(inventoryWithStats);
  } catch (error) {
    console.error('Fetch inventory error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}
