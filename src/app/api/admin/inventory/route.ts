import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import {
  ItemCondition,
  ReturnCondition,
  LoanStatus,
  InventoryStatus,
} from '@prisma/client';
import { SaveOneFileToDrive } from '@/lib/google-drive';

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

    // Calculate damaged items for each inventory
    const inventoryWithDamaged = inventories.map((inventory) => {
      // Count items in bad condition from inventory
      const inventoryRusak =
        inventory.kondisi === ItemCondition.RUSAK
          ? inventory.totalKuantitas
          : 0;

      // Count items returned in bad condition from loan requests for this inventory
      const returnedRusak = loanRequests
        .filter(
          (req) =>
            req.inventoryId === inventory.id &&
            req.returnedCondition === ReturnCondition.RUSAK
        )
        .reduce((acc, req) => acc + req.kuantitas, 0);

      // Calculate total damaged items
      const totalItemRusak = inventoryRusak + returnedRusak;

      // Calculate borrowed items for this inventory
      const totalItemDipinjam = loanRequests
        .filter(
          (req) =>
            req.inventoryId === inventory.id &&
            req.status === LoanStatus.DELIVERED
        )
        .reduce((acc, req) => acc + req.kuantitas, 0);

      return {
        ...inventory,
        totalItemRusak,
        totalItemDipinjam,
        totalItemBaik:
          inventory.totalKuantitas - totalItemRusak - totalItemDipinjam,
      };
    });

    return NextResponse.json(inventoryWithDamaged);
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
    const token = await getToken({ req });
    if (!token?.sub || token.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const kategori = formData.get('kategori') as string;
    const totalKuantitas = Number(formData.get('totalKuantitas'));
    const kondisi = formData.get('kondisi') as ItemCondition;
    const imageFile = formData.get('image') as File;

    if (!name || !kategori || !totalKuantitas || !kondisi) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    let imageUrl = '';
    if (imageFile) {
      imageUrl = await SaveOneFileToDrive(imageFile, imageFile.name);
    }

    const inventory = await prisma.inventory.create({
      data: {
        name,
        kategori,
        totalKuantitas,
        kondisi,
        imageUrl,
        status: InventoryStatus.Available,
      },
    });

    return NextResponse.json(inventory);
  } catch (error) {
    console.error('Create inventory error:', error);
    return NextResponse.json(
      { message: 'Failed to create inventory item' },
      { status: 500 }
    );
  }
}
