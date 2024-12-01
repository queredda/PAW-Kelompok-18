import { getModelForClass, prop, ReturnModelType } from '@typegoose/typegoose';
import mongoose from 'mongoose';

export class Counter {
  @prop({ required: true })
  public _id!: string;

  @prop({ required: true, default: 0 })
  public seq!: number;
}

// Initialize counters if they don't exist
async function initializeCounters() {
  try {
    const counters = ['loanRequestId', 'inventoryId'];
    for (const counterId of counters) {
      const counter = await CounterModel.findById(counterId);
      if (!counter) {
        await CounterModel.create({ _id: counterId, seq: 0 });
        console.log(`Counter ${counterId} initialized successfully`);
      }
    }
  } catch (error) {
    console.error('Error initializing counters:', error);
  }
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

// Initialize counters when the model is created
if (mongoose.connection.readyState === 1) {
  initializeCounters();
}

// Export function to be used elsewhere if needed
export { initializeCounters }; 