export type RequestStatus = 'Proses' | 'Delivered' | 'Canceled' | 'Borrowed' | 'Returned';
export type ReturnCondition = 'baik' | 'rusak';

export interface LoanRequest {
  status: RequestStatus;
  returnedCondition?: ReturnCondition;
  kuantitas: number;
  inventoryId: number;
} 