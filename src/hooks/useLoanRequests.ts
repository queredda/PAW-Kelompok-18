import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { LoanRequest } from '@/types/loan';

interface LoanRequestsData {
  pending: LoanRequest[];
  borrowed: LoanRequest[];
  returned: LoanRequest[];
}

interface RawLoanRequest {
  product?: {
    name: string;
    image: string;
  };
  name?: string;
  imageUrl?: string;
  trackingId?: string;
  loanId: number;
  customer?: string;
  namaUser?: string;
  date?: string;
  createdAt?: string;
  amount?: number;
  kuantitas?: number;
  status: string;
  isReturned: boolean;
  returnedCondition: string;
  inventoryId: number;
}

export function useLoanRequests() {
  const [data, setData] = useState<LoanRequestsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoanRequests = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/loan-requests');
        
        const transformedData = {
          pending: response.data.pending.map(transformLoanRequest),
          borrowed: response.data.borrowed.map(transformLoanRequest),
          returned: response.data.returned.map(transformLoanRequest),
        };
        
        setData(transformedData);
      } catch (err) {
        console.error('Error fetching loan requests:', err);
        setError('Failed to fetch loan requests');
      } finally {
        setLoading(false);
      }
    };

    fetchLoanRequests();
  }, []);

  return { data, loading, error };
}

function transformLoanRequest(item: RawLoanRequest): LoanRequest {
  return {
    ...item,
    product: {
      name: item.product?.name || item.name || '',
      image: item.product?.image || item.imageUrl || '/placeholder.svg',
    },
    trackingId: item.trackingId || `LR-${item.loanId}`,
    customer: item.customer || item.namaUser || 'Unknown User',
    date: item.date || item.createdAt || new Date().toLocaleDateString(),
    amount: item.amount || item.kuantitas || 0,
    status: item.status,
    loanId: item.loanId,
    name: item.name || '',
    namaUser: item.namaUser || '',
    imageUrl: item.imageUrl || '',
    isReturned: item.isReturned,
    returnedCondition: item.returnedCondition,
    inventoryId: item.inventoryId,
    kuantitas: item.kuantitas || 0,
  };
} 