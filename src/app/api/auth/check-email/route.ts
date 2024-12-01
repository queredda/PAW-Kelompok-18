import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { UserModel } from '@/models/User';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();
    
    console.log('Checking email:', normalizedEmail);
    console.log('DB Connection Status:', mongoose.connection.readyState);

    const user = await UserModel.findOne({ 
      email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') }
    });

    console.log('Found user:', user ? 'Yes' : 'No');
    
    return NextResponse.json({ 
      exists: !!user,
      debug: {
        searchedEmail: normalizedEmail,
        found: !!user,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error checking email:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        debug: {
          errorType: error.constructor.name,
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
} 