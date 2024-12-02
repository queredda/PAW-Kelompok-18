import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import { LoanStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token?.sub) {
      return NextResponse.json(
        { message: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log('Received request body:', body);

    const { inventoryId, kuantitas } = body;

    // Validate input
    if (!inventoryId || typeof kuantitas !== 'number' || kuantitas <= 0) {
      return NextResponse.json(
        { message: 'Invalid input data', received: { inventoryId, kuantitas } },
        { status: 400 }
      );
    }

    // Get inventory with all required fields
    const inventory = await prisma.inventory.findUnique({
      where: { id: inventoryId },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        totalKuantitas: true,
        kondisi: true,
        loanRequests: {
          where: {
            status: LoanStatus.DELIVERED,
            isReturned: false
          },
          select: {
            kuantitas: true
          }
        }
      }
    });

    console.log('Found inventory:', JSON.stringify(inventory, null, 2));

    if (!inventory) {
      return NextResponse.json(
        { message: 'Inventory item not found', inventoryId },
        { status: 404 }
      );
    }

    // Calculate available items based on total quantity and borrowed items
    const borrowedItems = inventory.loanRequests.reduce(
      (total, loan) => total + loan.kuantitas, 
      0
    );
    const availableItems = inventory.totalKuantitas - borrowedItems;

    console.log('Availability check:', {
      totalKuantitas: inventory.totalKuantitas,
      borrowedItems,
      availableItems,
      requestedQuantity: kuantitas
    });

    if (kuantitas > availableItems) {
      return NextResponse.json(
        { 
          message: `Only ${availableItems} items available for loan`,
          availableItems,
          requested: kuantitas
        },
        { status: 400 }
      );
    }

    // Create loan request
    const loanRequest = await prisma.$transaction(async (tx) => {
      // First check if there are any existing requests
      const existingRequest = await tx.loanRequest.findFirst({
        where: {
          accountId: token.sub,
          inventoryId,
          status: LoanStatus.PROSES,
        }
      });

      if (existingRequest) {
        throw new Error('You already have a pending request for this item');
      }

      if (!token?.sub) {
        throw new Error('User ID is required');
      }

      return tx.loanRequest.create({
        data: {
          accountId: token.sub,
          inventoryId,
          kuantitas,
          name: inventory.name,
          imageUrl: inventory.imageUrl,
          status: LoanStatus.PROSES,
          isReturned: false
        }
      });
    });

    console.log('Created loan request:', loanRequest);

    return NextResponse.json({
      success: true,
      data: loanRequest
    });

  } catch (error) {
    console.error('Create loan request error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    
    return NextResponse.json(
      { success: false, message: 'Failed to create loan request' },
      { status: 500 }
    );
  }
}
