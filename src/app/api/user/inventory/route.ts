import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/lib/db';
import { getModels } from '@/lib/models';
import { RequestStatus } from '@/models/LoanRequest';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ 
      req,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    console.log('Debug - Token:', token);

    if (!token?.id) {
      console.log('Debug - No token found or invalid token');
      return NextResponse.json(
        { message: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    await connectDB();
    const { InventoryModel, LoanRequestModel } = getModels();

    // Get all inventory items
    const inventoryItems = await InventoryModel.find({
      status: 'Available'
    });

    // Get all active loan requests and returned items with bad condition
    const activeLoanRequests = await LoanRequestModel.find({
      $or: [
        { 
          status: { $in: [RequestStatus.Proses, RequestStatus.Delivered] },
          isReturned: false 
        },
        {
          isReturned: true,
          returnedCondition: 'rusak'
        }
      ]
    });

    // Calculate available quantities for each item
    const availableItems = inventoryItems.map(item => {
      // Find all active loans and damaged items for this item
      const itemLoans = activeLoanRequests.filter(loan => 
        loan.inventoryId === item.id
      );

      // Calculate total borrowed quantity
      const borrowedQuantity = itemLoans.reduce((total, loan) => 
        total + (loan.isReturned ? 0 : loan.kuantitas), 0
      );

      // Calculate total damaged quantity
      const damagedQuantity = itemLoans.reduce((total, loan) => 
        total + (loan.isReturned && loan.returnedCondition === 'rusak' ? loan.kuantitas : 0), 0
      );

      // Calculate remaining good condition quantity
      const remainingQuantity = item.totalKuantitas - borrowedQuantity - damagedQuantity;

      if (remainingQuantity > 0 || damagedQuantity > 0) {
        return {
          ...item.toObject(),
          totalKuantitas: remainingQuantity,
          kondisi: remainingQuantity > 0 ? 'baik' : 'rusak',
          damagedQuantity: damagedQuantity
        };
      }
      return null;
    }).filter(item => item !== null);

    // Split items by condition if they have both good and damaged quantities
    const finalItems = availableItems.flatMap(item => {
      if (!item) return [];
      
      const items = [];
      if (item.totalKuantitas > 0) {
        items.push({
          ...item,
          kondisi: 'baik',
          totalKuantitas: item.totalKuantitas
        });
      }
      if (item.damagedQuantity > 0) {
        items.push({
          ...item,
          kondisi: 'rusak',
          totalKuantitas: item.damagedQuantity
        });
      }
      return items;
    });

    return NextResponse.json(finalItems);
  } catch (error) {
    console.error('Fetch inventory error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
} 