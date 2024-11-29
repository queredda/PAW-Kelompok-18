import { NextRequest, NextResponse } from 'next/server';
import { AuthController } from '@/controllers/auth';
import connectDB from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Validate role
    if (body.role && !['admin', 'user'].includes(body.role)) {
      return NextResponse.json(
        { message: 'Invalid role specified' },
        { status: 400 }
      );
    }
    
    const user = await AuthController.register(body);
    
    return NextResponse.json({ 
      message: 'Registration successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Registration failed' },
      { status: error instanceof Error && error.message.includes('exists') ? 409 : 500 }
    );
  }
} 