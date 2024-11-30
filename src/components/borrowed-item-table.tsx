'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';
import { LoanRequest } from '@/types/loan';

interface BorrowedItemsTableProps {
  items: LoanRequest[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function BorrowedItemsTable({
  items,
  currentPage,
  totalPages,
  onPageChange,
}: BorrowedItemsTableProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleAction = async (loanId: number, action: 'Terima' | 'Tolak') => {
    try {
      setIsLoading(true);
      const response = await api.patch('/api/admin/loan-requests', {
        loanId: loanId,
        status: action,
      });

      if (response.data) {
        toast({
          title: 'Success',
          description: `Request ${
            action === 'Terima' ? 'accepted' : 'rejected'
          } successfully`,
        });
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating loan request:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          axiosError.response?.data?.message || 'Failed to update loan request',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturn = async (condition: 'baik' | 'rusak') => {
    if (!selectedLoanId) return;

    try {
      setIsLoading(true);
      const response = await api.patch('/api/admin/returned-items', {
        loanId: selectedLoanId,
        returnedCondition: condition,
      });

      if (response.data) {
        toast({
          title: 'Success',
          description: 'Item return status updated successfully',
        });
        setIsDialogOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating return status:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          axiosError.response?.data?.message ||
          'Failed to update return status',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openReturnDialog = (loanId: number) => {
    setSelectedLoanId(loanId);
    setIsDialogOpen(true);
  };

  if (!items || items.length === 0) {
    return <div className="text-Text-A font-pop">No items to display</div>;
  }

  const renderTableContent = (status: string) => (
    <div className="rounded-md border border-white/10 bg-white/5">
      <Table>
        <TableHeader>
          <TableRow className="border-white/20">
            <TableHead className="text-Text-A font-pop">Tracking ID</TableHead>
            <TableHead className="text-Text-A font-pop">Product</TableHead>
            <TableHead className="text-Text-A font-pop">Customer</TableHead>
            <TableHead className="text-Text-A font-pop">Date</TableHead>
            <TableHead className="text-Text-A font-pop">Amount</TableHead>
            <TableHead className="text-Text-A font-pop">Status</TableHead>
            {status === 'Proses' && (
              <TableHead className="text-Text-A font-pop">Action</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items
            .filter((item) => item.status === status)
            .map((item) => (
              <TableRow key={item.trackingId} className="border-white/5">
                <TableCell className="font-medium text-Text-A font-pop">
                  {item.trackingId}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-8 w-8 rounded-full"
                      width={32}
                      height={32}
                    />
                    <span className="text-Text-A font-pop">
                      {item.product.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-Text-A font-pop">
                  {item.customer}
                </TableCell>
                <TableCell className="text-Text-A font-pop">
                  {item.date}
                </TableCell>
                <TableCell className="text-Text-A font-pop">
                  {item.amount}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold font-pop ${
                      status === 'Proses'
                        ? 'bg-yellow-500/10 text-yellow-500'
                        : status === 'Delivered'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-red-500/10 text-red-500'
                    }`}
                  >
                    {item.status}
                  </span>
                </TableCell>
                {status === 'Proses' && (
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAction(item.loanId, 'Terima')}
                        disabled={isLoading}
                        variant="ghost"
                        className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-Text-A font-pop"
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleAction(item.loanId, 'Tolak')}
                        disabled={isLoading}
                        variant="ghost"
                        className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-Text-A font-pop"
                      >
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                )}
                {status === 'Delivered' && (
                  <TableCell>
                    <Button
                      onClick={() => openReturnDialog(item.loanId)}
                      disabled={isLoading}
                      variant="ghost"
                      className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-Text-A font-pop"
                    >
                      Return Item
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      <Tabs
        defaultValue="loan-requests"
        className="w-full flex flex-col min-h-[500px]"
      >
        <TabsList className="bg-transparent w-full h-fit font-pop flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-start">
          <TabsTrigger
            value="loan-requests"
            className="font-pop text-sm sm:text-base text-gray-500 data-[state=active]:text-Text-A data-[state=active]:font-bold data-[state=active]:underline data-[state=active]:bg-Background-A"
          >
            Loan Requests
          </TabsTrigger>
          <TabsTrigger
            value="borrowed"
            className="font-pop text-sm sm:text-base text-gray-500 data-[state=active]:text-Text-A data-[state=active]:font-bold data-[state=active]:underline data-[state=active]:bg-Background-A"
          >
            Borrowed Items
          </TabsTrigger>
          <TabsTrigger
            value="returned"
            className="font-pop text-sm sm:text-base text-gray-500 data-[state=active]:text-Text-A data-[state=active]:font-bold data-[state=active]:underline data-[state=active]:bg-Background-A"
          >
            Returned Items
          </TabsTrigger>
        </TabsList>

        <TabsContent value="loan-requests" className="mt-2 md:mt-4">
          {renderTableContent('Proses')}
        </TabsContent>

        <TabsContent value="borrowed" className="mt-2 md:mt-4">
          {renderTableContent('Delivered')}
        </TabsContent>

        <TabsContent value="returned" className="mt-2 md:mt-4">
          {renderTableContent('Canceled')}
        </TabsContent>

        {/* Pagination */}
        <div className="flex justify-center gap-2 flex-wrap mt-4">
          <Button
            variant="ghost"
            className="text-Text-A hover:bg-Secondary-A hover:text-Text-A"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft />
          </Button>
          {[...Array(totalPages)].map((_, index) => (
            <Button
              key={index + 1}
              variant="default"
              className={`text-sm md:text-base ${
                currentPage === index + 1
                  ? 'bg-Secondary-A text-Text-A hover:bg-Secondary-A/80'
                  : 'text-Text-A'
              } text-Text-A`}
              onClick={() => onPageChange(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
          <Button
            variant="ghost"
            className="text-Text-A hover:bg-Secondary-A hover:text-Text-A"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight />
          </Button>
        </div>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Item</DialogTitle>
            <DialogDescription>
              Select the condition of the returned item
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => handleReturn('baik')}
              disabled={isLoading}
              className="bg-green-500/10 text-green-500 hover:bg-green-500/20"
            >
              Good Condition
            </Button>
            <Button
              onClick={() => handleReturn('rusak')}
              disabled={isLoading}
              className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
            >
              Damaged
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
