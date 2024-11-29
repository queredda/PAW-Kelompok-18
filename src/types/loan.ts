export interface LoanRequest {
  trackingId?: string;
  product: {
    name: string;
    image: string;
  };
  customer?: string;
  date?: string;
  amount?: number;
  status: string;
  loanId: number;
  name: string;
  namaUser?: string;
  imageUrl?: string;
  isReturned: boolean;
  returnedCondition: string;
  inventoryId: number;
  kuantitas: number;
} 