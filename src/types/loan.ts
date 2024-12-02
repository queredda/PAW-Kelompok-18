import { LoanStatus, ReturnCondition } from '@prisma/client';

export interface LoanRequest {
  trackingId?: string;
  product: {
    name: string;
    image: string;
  };
  customer?: string;
  date?: string;
  amount?: number;
  status: LoanStatus;
  requestNumber: string;
  name: string;
  namaUser?: string;
  imageUrl?: string;
  isReturned: boolean;
  returnedCondition?: ReturnCondition | null;
  inventoryId: string;
  kuantitas: number;
} 