import { User, UserModel } from '@/models/User';
import createHttpError from 'http-errors';
import { DocumentType } from '@typegoose/typegoose';

export class AuthController {
  public static async loginWithEmail(data: {
    email: string;
    password: string;
  }): Promise<DocumentType<User>> {
    try {
      const { email, password } = data;
      if (!email || !password) {
        throw createHttpError(400, 'Email and password are required');
      }

      const user = await UserModel.findOne({ email });

      if (!user) {
        throw createHttpError(404, 'User not found');
      }

      if (user.password !== password) {
        throw createHttpError(401, 'Invalid password');
      }

      return user;
    } catch (error) {
      console.error('Login error:', error);
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

      // Create new user with explicit role
      const user = new UserModel({
        name,
        email,
        password,
        role: role || 'user', // Set role explicitly, default to 'user' if not provided
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