import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const account = await prisma.account.findUnique({
      where: { email }
    });

    return NextResponse.json({ exists: !!account });
  } catch (error) {
    console.error('Error checking email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 