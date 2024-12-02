import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const name = req.nextUrl.searchParams.get('name');

    if (!name) {
      return NextResponse.json(
        { message: 'Name parameter is required' },
        { status: 400 }
      );
    }

    const item = await prisma.inventory.findFirst({
      where: { name }
    });

    if (!item) {
      return NextResponse.json(
        { message: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      item: {
        id: item.id,
        name: item.name,
        kategori: item.kategori,
        imageUrl: item.imageUrl,
        status: item.status,
        kondisi: item.kondisi,
        totalKuantitas: item.totalKuantitas,
      },
    });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Validation failed' },
      { status: 500 }
    );
  }
}
