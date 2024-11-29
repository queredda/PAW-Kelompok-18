'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ImagePlus } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface SelectedItem {
  id: number;
  name: string;
  category: string;
  image: string;
  totalKuantitas?: number;
  kondisi: string;
}

export function ItemLoanForm() {
  const router = useRouter();
  const { status } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  useEffect(() => {
    const storedItem = localStorage.getItem('selectedItem');
    if (storedItem) {
      setSelectedItem(JSON.parse(storedItem));
    }
  }, []);

  const handleSubmit = async () => {
    if (status !== 'authenticated') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please log in to submit a loan request',
      });
      router.push('/login');
      return;
    }

    if (!selectedItem?.id) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Invalid item selected',
      });
      return;
    }

    if (selectedItem.kondisi === 'rusak') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Cannot borrow damaged items',
      });
      return;
    }

    if (quantity <= 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Quantity must be greater than 0',
      });
      return;
    }

    if (selectedItem.totalKuantitas && quantity > selectedItem.totalKuantitas) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Requested quantity exceeds available quantity',
      });
      return;
    }

    try {
      setLoading(true);
      await api.post('/user/loan-request', {
        inventoryId: selectedItem.id,
        kuantitas: quantity,
      });

      toast({
        title: 'Success',
        description: 'Loan request submitted successfully',
      });
      router.push('/employee');
    } catch (error) {
      console.error('Error creating loan request:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit loan request',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <Card className="bg-gradient-to-br from-Linear-A-from to-Linear-A-to text-Text-A border-none px-4 sm:px-10 py-3 sm:py-5 w-full max-w-[95vw] mx-auto">
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-col-reverse sm:grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4 w-full">
              <div>
                <Input
                  value={selectedItem?.name || ''}
                  placeholder="Item name"
                  className="bg-Input-A mt-1 text-Text-D rounded-[30px] px-4 w-full"
                  disabled
                />
              </div>
              <div>
                <Input
                  value={selectedItem?.category || ''}
                  placeholder="Category"
                  className="bg-Input-A mt-1 text-Text-D rounded-[30px] px-4 w-full"
                  disabled
                />
              </div>
              {selectedItem?.totalKuantitas && (
                <div className="text-sm text-Text-A">
                  Available Quantity: {selectedItem.totalKuantitas}
                </div>
              )}
              <div>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  placeholder="Quantity"
                  min={1}
                  max={selectedItem?.totalKuantitas}
                  className="bg-Input-A mt-1 text-Text-D rounded-[30px] px-4 w-full"
                  required
                />
              </div>
              <div className="flex items-center justify-center sm:justify-start">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-[40px] bg-[#413D79] hover:bg-[#413D79]/80 rounded-[30px]"
                >
                  {loading ? 'Processing...' : 'Submit Request'}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center bg-white/10 rounded-[30px] overflow-hidden mb-4 sm:mb-0 h-[200px] sm:h-[300px]">
              {selectedItem?.image ? (
                <div className="relative w-full h-full">
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="object-contain"
                    fill
                    sizes="(max-width: 640px) 95vw, (max-width: 768px) 50vw, 40vw"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <ImagePlus className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-Text-A/50" />
                  <p className="mt-2 text-xs sm:text-sm text-Text-A/70">
                    No image available
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="text-sm text-Text-A mb-2">
            Condition: {' '}
            <span className={selectedItem?.kondisi === 'rusak' ? 'text-red-500' : 'text-green-500'}>
              {selectedItem?.kondisi || 'Unknown'}
            </span>
            {selectedItem?.kondisi === 'rusak' && (
              <p className="text-red-500 text-xs mt-1">
                This item is damaged and cannot be borrowed
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
