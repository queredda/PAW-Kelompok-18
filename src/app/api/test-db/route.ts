import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { UserModel } from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    
    const count = await UserModel.countDocuments();
    
    return NextResponse.json({
      status: 'success',
      dbConnected: true,
      userCount: count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test DB Error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 