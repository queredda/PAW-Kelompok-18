import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getModels } from '@/lib/models';
import { getToken } from 'next-auth/jwt';
import { SaveOneFileToDrive } from '@/lib/google-drive';
import { RequestStatus } from '@/models/LoanRequest';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token?.sub || token.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
    
    await connectDB();
    const { InventoryModel, LoanRequestModel } = getModels();

    const inventoryItems = await InventoryModel.find();
    const loanRequests = await LoanRequestModel.find({
      $or: [
        { status: RequestStatus.Delivered, isReturned: false },
        { isReturned: true, returnedCondition: 'rusak' }
      ]
    });

    const itemsWithQuantities = inventoryItems.map(item => {
      const itemLoans = loanRequests.filter(loan => 
        loan.inventoryId === item.id
      );

      const borrowedQuantity = itemLoans.reduce((total, loan) => 
        total + (loan.isReturned ? 0 : loan.kuantitas), 0
      );

      const damagedQuantity = itemLoans.reduce((total, loan) => 
        total + (loan.isReturned && loan.returnedCondition === 'rusak' ? loan.kuantitas : 0), 0
      );

      const availableQuantity = item.totalKuantitas - borrowedQuantity - damagedQuantity;

      return {
        ...item.toObject(),
        availableQuantity,
        damagedQuantity,
        status: availableQuantity > 0 ? 'Available' : 'Out of Stock'
      };
    });

    return NextResponse.json(itemsWithQuantities);
  } catch (error) {
    console.error('Fetch inventory error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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
    const { InventoryModel } = getModels();

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const totalKuantitas = formData.get('totalKuantitas') as string;
    const kategori = formData.get('kategori') as string;
    const imageFile = formData.get('image') as File | null;

    if (!name || !totalKuantitas || !kategori) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    let imageUrl = 'https://drive.google.com/uc?export=view&id=1M0cUhm03x3uSCvLPkUjSk0HVjcg2OOMQ';
    
    if (imageFile && imageFile instanceof File) {
      try {
        imageUrl = await SaveOneFileToDrive(
          imageFile,
          `inventory-${name}-${Date.now()}`,
          imageFile.type
        );
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
      }
    }

    const inventory = new InventoryModel({
      name,
      totalKuantitas: parseInt(totalKuantitas),
      kategori,
      imageUrl,
      status: 'Available',
      kondisi: 'baik',
    });

    await inventory.save();

    return NextResponse.json(inventory, { status: 201 });
  } catch (error) {
    console.error('Create inventory error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to create inventory' },
      { status: 500 }
    );
  }
}