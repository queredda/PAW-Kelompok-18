import { LoanStatus, ReturnCondition } from '@prisma/client';

export type RequestStatus = LoanStatus;
export { ReturnCondition };

export interface LoanRequest {
  status: LoanStatus;
  returnedCondition?: ReturnCondition;
  kuantitas: number;
  inventoryId: string;
}
