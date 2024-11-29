import { getModelForClass, prop, pre, ReturnModelType } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { CounterModel } from './Counter';

@pre<Inventory>('save', async function () {
  if (this.isNew) {
    const counter = await CounterModel.findByIdAndUpdate(
      { _id: 'inventoryId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    this.id = counter.seq;
  }
})
export class Inventory {
  @prop()
  public id!: number;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public totalKuantitas!: number;

  @prop({ required: true })
  public kategori!: string;

  @prop({})
  public imageUrl?: string;

  @prop({ default: 'Available' })
  public status?: string;

  @prop({ default: 'baik' })
  public kondisi?: string;
}

// Prevent model recompilation
const modelName = 'Inventory';
export const InventoryModel = 
  (mongoose.models[modelName] as ReturnModelType<typeof Inventory>) || 
  getModelForClass(Inventory, {
    schemaOptions: { 
      timestamps: true,
      collection: 'inventories'
    }
  }); 