import { User, UserModel } from '@/models/User';
import createHttpError from 'http-errors';
import { DocumentType } from '@typegoose/typegoose';
import bcrypt from 'bcryptjs';

export class AuthController {
  public static async findUserByEmail(email: string): Promise<DocumentType<User>> {
    try {
      if (!email) {
        throw createHttpError(400, 'Email is required');
      }

      const user = await UserModel.findOne({ email });

      if (!user) {
        throw createHttpError(404, 'User not found');
      }

      return user;
    } catch (error) {
      console.error('Find user error:', error);
      throw error;
    }
  }

  public static async register(data: {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
  }): Promise<DocumentType<User>> {
    try {
      const { name, email, password, role } = data;
      
      if (!email || !password) {
        throw createHttpError(400, 'Email and password are required');
      }

      // Check if user already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        throw createHttpError(409, 'User already exists');
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user with explicit role and hashed password
      const user = new UserModel({
        name,
        email,
        password: hashedPassword, // Store the hashed password
        role: role || 'user',
      });

      await user.save();
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  public static async getProfile(userId: string): Promise<DocumentType<User>> {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw createHttpError(404, 'User not found');
      }
      return user;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  public static async updateProfile(
    userId: string,
    data: {
      name?: string;
      profilePic?: string;
    }
  ): Promise<DocumentType<User>> {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw createHttpError(404, 'User not found');
      }

      if (data.name) user.name = data.name;
      if (data.profilePic) user.profilePic = data.profilePic;

      await user.save();
      return user;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  public static async changeRole(
    userId: string,
    role: 'admin' | 'user'
  ): Promise<DocumentType<User>> {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw createHttpError(404, 'User not found');
      }

      user.role = role;
      await user.save();
      return user;
    } catch (error) {
      console.error('Change role error:', error);
      throw error;
    }
  }
} 