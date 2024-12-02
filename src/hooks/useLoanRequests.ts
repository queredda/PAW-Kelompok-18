import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface LoanRequestWithRelations {
  requestNumber: string;
  status: string;
  inventory: {
    name: string;
  };
  account: {
    username: string;
  };
}

export function useLoanRequests() {
  const { status } = useSession();
  const [data, setData] = useState<LoanRequestWithRelations[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoanRequests = async () => {
      if (status !== 'authenticated') {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get('/api/admin/loan-management');

        if (data) {
          setData(data);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching loan requests:', err);
        setError('Failed to fetch loan requests');
      } finally {
        setLoading(false);
      }
    };

    fetchLoanRequests();
  }, [status]);

  return { data, loading, error } as {
    data: LoanRequestWithRelations[] | null;
    loading: boolean;
    error: string | null;
  };
}
