import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    return NextResponse.json({ status: 'API is running' });
  } catch {
    return NextResponse.json(
      { message: 'Database connection failed' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
}; 