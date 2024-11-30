import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getModels } from '@/lib/models';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { InventoryModel, LoanRequestModel } = getModels();

    const token = await getToken({ req });

    if (!token?.sub) {
      return NextResponse.json(
        { message: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { inventoryId, kuantitas } = body;

    if (!inventoryId || !kuantitas) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    const inventory = await InventoryModel.findOne({ id: inventoryId });
    if (!inventory) {
      return NextResponse.json(
        { message: 'Inventory not found' },
        { status: 404 }
      );
    }

    // Create loan request with the user ID from token
    const loanRequest = new LoanRequestModel({
      inventoryId: Number(inventoryId),
      userId: token.sub,
      name: inventory.name,
      kuantitas: Number(kuantitas),
      imageUrl: inventory.imageUrl,
    });

    await loanRequest.save();

    return NextResponse.json(loanRequest, { status: 201 });
  } catch (error) {
    console.error('Create loan request error:', error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create loan request',
      },
      { status: 500 }
    );
  }
}
