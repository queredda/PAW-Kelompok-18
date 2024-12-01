import { getModelForClass, prop, ReturnModelType } from '@typegoose/typegoose';
import mongoose from 'mongoose';

export class User {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ default: 'user', enum: ['user', 'admin'] })
  public role!: string;

  @prop()
  public profilePic?: string;
}

// Prevent model recompilation
const modelName = 'User';
export const UserModel = 
  (mongoose.models[modelName] as ReturnModelType<typeof User>) || 
  getModelForClass(User, {
    schemaOptions: { 
      timestamps: true,
      collection: 'users',
      _id: true, // Explicitly enable _id
      strict: true // Enforce schema validation
    }
  }); 