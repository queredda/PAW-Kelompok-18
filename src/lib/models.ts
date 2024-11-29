import mongoose from 'mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Counter, CounterModel } from '@/models/Counter';
import { Inventory, InventoryModel } from '@/models/Inventory';
import { LoanRequest, LoanRequestModel } from '@/models/LoanRequest';
import { User, UserModel } from '@/models/User';

export function getModels() {
  const models = mongoose.models;

  return {
    CounterModel: (models.Counter as ReturnModelType<typeof Counter>) || CounterModel,
    InventoryModel: (models.Inventory as ReturnModelType<typeof Inventory>) || InventoryModel,
    LoanRequestModel: (models.LoanRequest as ReturnModelType<typeof LoanRequest>) || LoanRequestModel,
    UserModel: (models.User as ReturnModelType<typeof User>) || UserModel,
  };
}
