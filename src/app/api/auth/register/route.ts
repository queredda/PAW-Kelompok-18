import { NextRequest, NextResponse } from 'next/server';
import { AuthController } from '@/controllers/auth';
import connectDB from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    console.log('Starting registration process');
    await connectDB();
    console.log('Database connected');
    
    const body = await req.json();
    console.log('Request body:', body);
    
    // Validate role
    if (body.role && !['admin', 'user'].includes(body.role)) {
      console.log('Invalid role specified:', body.role);
      return NextResponse.json(
        { message: 'Invalid role specified' },
        { status: 400 }
      );
    }
    
    console.log('Registering user with data:', body);
    const user = await AuthController.register(body);
    console.log('User registered successfully:', user._id);
    
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
    // Log the full error object for debugging
    console.error('Full error object:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Registration failed' },
      { status: error instanceof Error && error.message.includes('exists') ? 409 : 500 }
    );
  }
}