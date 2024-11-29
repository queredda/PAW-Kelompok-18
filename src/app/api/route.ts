import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ status: 'API is running' });
  } catch {
    return NextResponse.json(
      { message: 'Database connection failed' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
}; 