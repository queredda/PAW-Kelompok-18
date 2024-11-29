import { getModelForClass, prop, ReturnModelType } from '@typegoose/typegoose';
import mongoose from 'mongoose';

export class Counter {
  @prop({ required: true })
  public _id!: string;

  @prop({ required: true })
  public seq!: number;
}

// Prevent model recompilation
const modelName = 'Counter';
export const CounterModel = 
  (mongoose.models[modelName] as ReturnModelType<typeof Counter>) || 
  getModelForClass(Counter, {
    schemaOptions: { 
      collection: 'counters'
    }
  }); 