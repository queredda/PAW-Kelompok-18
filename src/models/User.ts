import { prop, getModelForClass} from "@typegoose/typegoose";

class User {
  @prop({ required: true, trim: true })
  public googleId!: string;

  @prop({ required: true, trim: true })
  public name!: string;

  @prop({ required: true, unique: true, trim: true })
  public email!: string;

  @prop({ default: 'user' })
  public role?: string;

  @prop({})
  public profilePictureUrl?: string;
}

export const UserModel = getModelForClass(User);
