import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { UserModel } from '@/models/User';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    const user = await UserModel.findOne({ email });
    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error('Error checking email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 