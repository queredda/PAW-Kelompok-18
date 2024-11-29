import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getModels } from '@/lib/models';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { InventoryModel } = getModels();
    const name = req.nextUrl.searchParams.get('name');

    if (!name) {
      return NextResponse.json(
        { message: 'Name parameter is required' },
        { status: 400 }
      );
    }

    const item = await InventoryModel.findOne({ name });

    if (!item) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({
      valid: true,
      item: {
        id: item.id,
        name: item.name,
        kategori: item.kategori,
        imageUrl: item.imageUrl,
        status: item.status || 'Available',
        kondisi: item.kondisi || 'baik',
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
