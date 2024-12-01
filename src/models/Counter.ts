import { getModelForClass, prop, ReturnModelType } from '@typegoose/typegoose';
import mongoose from 'mongoose';

export class Counter {
  @prop({ required: true, type: String })
  public _id!: string;

  @prop({ required: true, default: 0, type: Number })
  public seq!: number;
}

// Initialize counters if they don't exist
async function initializeCounters() {
  try {
    const countersToInit = [
      { _id: 'loanRequestId', seq: 0 },
      { _id: 'inventoryId', seq: 0 }
    ];

    for (const counterData of countersToInit) {
      // Use findOneAndUpdate with upsert to safely create or update counter
      await CounterModel.findOneAndUpdate(
        { _id: counterData._id },
        { $setOnInsert: { seq: counterData.seq } },
        { 
          upsert: true, 
          new: true,
          runValidators: true 
        }
      );
      console.log(`Counter ${counterData._id} initialized successfully`);
    }
  } catch (error) {
    console.error('Error initializing counters:', error);
    throw error; // Rethrow to handle in the connection logic
  }
}

// Prevent model recompilation
const modelName = 'Counter';
export const CounterModel = 
  (mongoose.models[modelName] as ReturnModelType<typeof Counter>) || 
  getModelForClass(Counter, {
    schemaOptions: { 
      collection: 'counters',
      _id: true, // Explicitly enable _id
      strict: true // Enforce schema validation
    }
  });

// Export function to be used elsewhere if needed
export { initializeCounters };

// Initialize counters when the model is created
if (mongoose.connection.readyState === 1) {
  initializeCounters().catch(console.error);
} 