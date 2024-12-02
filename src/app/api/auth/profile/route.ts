import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import { SaveOneFileToDrive } from '@/lib/google-drive';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token?.sub) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.account.findUnique({
      where: { id: token.sub },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userProfile = {
      id: user.id,
      name: user.username || 'Anonymous',
      email: user.email,
      role: user.role,
      profilePic: user.profilePic || null,
    };

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token?.sub) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const file = formData.get('file') as File | null;

    // Check if user exists using Prisma
    const existingUser = await prisma.account.findUnique({
      where: { id: token.sub },
    });

    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Handle profile picture upload
    let profilePic = undefined;
    if (file && file instanceof File) {
      try {
        profilePic = await SaveOneFileToDrive(file, file.name);
      } catch (error) {
        console.error('File upload error:', error);
        return NextResponse.json(
          { message: 'Failed to upload profile picture' },
          { status: 500 }
        );
      }
    }

    // Update user with Prisma
    const updatedUser = await prisma.account.update({
      where: { id: token.sub },
      data: {
        username: name || existingUser.username,
        email: email || existingUser.email,
        profilePic: profilePic || existingUser.profilePic,
      },
    });

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      profilePic: updatedUser.profilePic,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
