import { getModelForClass, prop, ReturnModelType } from '@typegoose/typegoose';
import mongoose from 'mongoose';

export class User {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ default: 'user' })
  public role!: string;

  @prop()
  public profilePic?: string;
}

const modelName = 'User';
export const UserModel = 
  (mongoose.models[modelName] as ReturnModelType<typeof User>) || 
  getModelForClass(User, {
    schemaOptions: { 
      timestamps: true,
      collection: 'users'
    }
  }); 