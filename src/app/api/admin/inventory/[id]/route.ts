import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { SaveOneFileToDrive } from '@/lib/google-drive';

interface UpdateData {
  name?: string;
  kategori?: string;
  totalKuantitas?: number;
  imageUrl?: string;
}

export async function PATCH(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    const token = await getToken({ req: request as NextRequest });
    if (!token?.sub || token.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const kategori = formData.get('kategori') as string;
    const totalKuantitas = Number(formData.get('totalKuantitas'));
    const imageFile = formData.get('image') as File;

    const updateData: UpdateData = {};
    if (name) updateData.name = name;
    if (kategori) updateData.kategori = kategori;
    if (totalKuantitas) updateData.totalKuantitas = totalKuantitas;

    if (imageFile) {
      const imageUrl = await SaveOneFileToDrive(imageFile, 'inventory', id);
      updateData.imageUrl = imageUrl;
    }

    const inventory = await prisma.inventory.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(inventory);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        { message: 'Database error', error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    const token = await getToken({ req: request });
    if (!token?.sub || token.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Check if inventory exists and has associated loan requests
    const inventory = await prisma.inventory.findUnique({
      where: { id },
      include: {
        loanRequests: true
      }
    });

    if (!inventory) {
      return NextResponse.json(
        { message: 'Inventory item not found' },
        { status: 404 }
      );
    }

    // Check for active (non-completed) loan requests
    const activeLoanRequests = inventory.loanRequests.filter(
      loan => loan.status !== 'COMPLETED' || !loan.isReturned
    );

    if (activeLoanRequests.length > 0) {
      return NextResponse.json(
        { 
          message: 'Cannot delete inventory item with active loan requests',
          activeLoans: activeLoanRequests.length
        },
        { status: 400 }
      );
    }

    // Delete all completed loan requests first
    await prisma.loanRequest.deleteMany({
      where: {
        inventoryId: id,
        status: 'COMPLETED',
        isReturned: true
      }
    });

    // Now delete the inventory
    const deletedInventory = await prisma.inventory.delete({
      where: { id },
    });

    return NextResponse.json(
      { 
        message: 'Item and associated loan requests deleted successfully', 
        data: deletedInventory 
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        { message: 'Database error', error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
