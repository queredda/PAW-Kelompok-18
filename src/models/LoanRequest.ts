import { getModelForClass, prop, pre, ReturnModelType } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { CounterModel } from './Counter';

export enum RequestStatus {
  Proses = 'Proses',
  Delivered = 'Delivered',
  Canceled = 'Canceled'
}

export enum ReturnedCondition {
  Baik = 'baik',
  Rusak = 'rusak'
}

@pre<LoanRequest>('save', async function() {
  if (this.isNew) {
    try {
      const counter = await CounterModel.findByIdAndUpdate(
        { _id: 'loanRequestId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      
      if (!counter || typeof counter.seq !== 'number') {
        throw new Error('Failed to generate sequence number');
      }
      
      this.loanId = counter.seq;
    } catch (error) {
      console.error('Error generating loan ID:', error);
      throw error;
    }
  }
})
export class LoanRequest {
  @prop()
  public loanId!: number;

  @prop({ required: true })
  public inventoryId!: number;

  @prop({ required: true })
  public userId!: mongoose.Types.ObjectId;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public kuantitas!: number;

  @prop({ default: RequestStatus.Proses })
  public status!: RequestStatus;

  @prop({ default: false })
  public isReturned!: boolean;

  @prop({ enum: ReturnedCondition })
  public returnedCondition?: ReturnedCondition;

  @prop()
  public imageUrl?: string;

  @prop()
  public namaUser?: string;
}

// Prevent model recompilation
const modelName = 'LoanRequest';
export const LoanRequestModel =
  (mongoose.models[modelName] as ReturnModelType<typeof LoanRequest>) ||
  getModelForClass(LoanRequest, {
    schemaOptions: {
      timestamps: true,
      collection: 'loanrequests',
    },
  });