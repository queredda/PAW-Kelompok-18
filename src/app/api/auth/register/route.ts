import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password: passwordInput, role } = await req.json();

    if (!name || !email || !passwordInput) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.account.findFirst({
      where: {
        OR: [{ email }, { username: name }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email or username' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(passwordInput, 10);

    // Create user
    const user = await prisma.account.create({
      data: {
        username: name,
        email,
        password: hashedPassword,
        role: role.toUpperCase() as Role,
      },
    });

    // Remove password from response
    const { ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Failed to register user' },
      { status: 500 }
    );
  }
}
