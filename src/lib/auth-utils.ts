import { PrismaClient, Role } from '@prisma/client';
import { createHttpError } from 'http-errors';

const prisma = new PrismaClient();

export async function getProfile(userId: string) {
  try {
    const user = await prisma.account.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      throw createHttpError(404, 'User not found');
    }
    
    return user;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
}

export async function updateProfile(
  userId: string,
  data: {
    username?: string;
    profilePic?: string;
  }
) {
  try {
    const user = await prisma.account.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const updatedUser = await prisma.account.update({
      where: { id: userId },
      data: {
        username: data.username || user.username,
        profilePic: data.profilePic || user.profilePic
      }
    });

    return updatedUser;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
}

export async function changeRole(
  userId: string,
  role: Role
) {
  try {
    const user = await prisma.account.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const updatedUser = await prisma.account.update({
      where: { id: userId },
      data: { role }
    });

    return updatedUser;
  } catch (error) {
    console.error('Change role error:', error);
    throw error;
  }
}
