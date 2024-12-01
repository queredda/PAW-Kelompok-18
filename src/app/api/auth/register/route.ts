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
    console.log('User registered successfully:', {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    });
    
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
    // Log the full error details
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Registration failed',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { 
        status: error instanceof Error && error.message.includes('exists') 
          ? 409 
          : 500 
      }
    );
  }
}