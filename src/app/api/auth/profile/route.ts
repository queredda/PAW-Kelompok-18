import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/lib/db';
import { getModels } from '@/lib/models';
import { SaveOneFileToDrive } from '@/lib/google-drive';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token?.sub) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { UserModel } = getModels();

    const user = await UserModel.findById(token.sub);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Remove sensitive data and ensure all required fields are present
    const userProfile = {
      id: user._id.toString(),
      name: user.name || 'Anonymous',
      email: user.email,
      role: user.role,
      profilePic: user.profilePic || null
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

    await connectDB();
    const { UserModel } = getModels();

    const user = await UserModel.findById(token.sub);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Update basic info
    if (name) user.name = name;
    if (email) user.email = email;

    // Handle profile picture upload
    if (file && file instanceof File) {
      try {
        const imageUrl = await SaveOneFileToDrive(
          file,
          `profile-${user._id}-${Date.now()}`,
          file.type
        );
        user.profilePic = imageUrl;
      } catch (uploadError) {
        console.error('Profile picture upload error:', uploadError);
        return NextResponse.json(
          { message: 'Failed to upload profile picture' },
          { status: 500 }
        );
      }
    }

    await user.save();

    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic
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