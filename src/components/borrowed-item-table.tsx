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
import { useToast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';
import { LoanStatus, ReturnCondition } from '@prisma/client';
import { updateLoanRequestStatus, updateReturnedItem } from '@/lib/api';

interface BorrowedItem {
  id: string;
  requestNumber: string;
  name: string;
  kuantitas: number;
  status: LoanStatus;
  isReturned: boolean;
  returnedCondition: ReturnCondition | null;
  imageUrl: string | null;
  createdAt: string;
  account: {
    username: string;
  };
  inventory: {
    imageUrl: string | null;
    name: string;
  };
}

interface BorrowedItemsTableProps {
  items: BorrowedItem[];
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
  const [selectedRequestNumber, setSelectedRequestNumber] =
    useState<string>('');
  const { toast } = useToast();

  const handleAction = async (
    requestNumber: string,
    action: 'Terima' | 'Tolak'
  ) => {
    try {
      setIsLoading(true);
      await updateLoanRequestStatus({
        requestNumber,
        status: action,
      });

      toast({
        title: 'Success',
        description: `Request ${
          action === 'Terima' ? 'accepted' : 'rejected'
        } successfully`,
      });
      window.location.reload();
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

  const handleReturn = async (condition: ReturnCondition) => {
    if (!selectedRequestNumber) return;

    try {
      setIsLoading(true);
      await updateReturnedItem({
        requestNumber: selectedRequestNumber,
        returnedCondition: condition,
      });

      toast({
        title: 'Success',
        description: 'Item return status updated successfully',
      });
      setIsDialogOpen(false);
      window.location.reload();
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

  const openReturnDialog = (requestNumber: string) => {
    setSelectedRequestNumber(requestNumber);
    setIsDialogOpen(true);
  };

  if (!items || items.length === 0) {
    return <div className="text-Text-A font-pop">No items to display</div>;
  }

  const renderTableContent = (status: LoanStatus) => (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px] rounded-md border border-white/10 bg-white/5">
        <Table>
          <TableHeader>
            <TableRow className="border-white/20">
              <TableHead className="text-Text-A font-pop whitespace-nowrap">Tracking ID</TableHead>
              <TableHead className="text-Text-A font-pop whitespace-nowrap">Product</TableHead>
              <TableHead className="text-Text-A font-pop whitespace-nowrap">Customer</TableHead>
              <TableHead className="text-Text-A font-pop whitespace-nowrap">Date</TableHead>
              <TableHead className="text-Text-A font-pop whitespace-nowrap">Amount</TableHead>
              <TableHead className="text-Text-A font-pop whitespace-nowrap">Status</TableHead>
              {status === LoanStatus.PROSES && (
                <TableHead className="text-Text-A font-pop whitespace-nowrap">Action</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items
              .filter((item) => item.status === status)
              .map((item) => (
                <TableRow key={item.requestNumber} className="border-white/5">
                  <TableCell className="font-medium text-Text-A font-pop max-w-[100px] truncate">
                    {item.requestNumber}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="relative h-8 w-8 shrink-0">
                        <Image
                          src={item.inventory.imageUrl || '/placeholder-image.jpg'}
                          alt={item.inventory.name}
                          className="rounded-full object-cover"
                          fill
                          sizes="32px"
                        />
                      </div>
                      <span className="text-Text-A font-pop truncate">
                        {item.inventory.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-Text-A font-pop whitespace-nowrap">
                    {item.account.username}
                  </TableCell>
                  <TableCell className="text-Text-A font-pop whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="text-Text-A font-pop whitespace-nowrap">
                    {item.kuantitas}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold font-pop whitespace-nowrap ${
                        status === LoanStatus.PROSES
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : status === LoanStatus.DELIVERED
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  {status === LoanStatus.PROSES && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            handleAction(item.requestNumber, 'Terima')
                          }
                          disabled={isLoading}
                          variant="ghost"
                          className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-Text-A font-pop whitespace-nowrap"
                        >
                          Accept
                        </Button>
                        <Button
                          onClick={() =>
                            handleAction(item.requestNumber, 'Tolak')
                          }
                          disabled={isLoading}
                          variant="ghost"
                          className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-Text-A font-pop whitespace-nowrap"
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  )}
                  {status === LoanStatus.DELIVERED && (
                    <TableCell>
                      <Button
                        onClick={() => openReturnDialog(item.requestNumber)}
                        disabled={isLoading}
                        variant="ghost"
                        className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-Text-A font-pop whitespace-nowrap"
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
          {renderTableContent(LoanStatus.PROSES)}
        </TabsContent>

        <TabsContent value="borrowed" className="mt-2 md:mt-4">
          {renderTableContent(LoanStatus.DELIVERED)}
        </TabsContent>

        <TabsContent value="returned" className="mt-2 md:mt-4">
          {renderTableContent(LoanStatus.COMPLETED)}
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
        <DialogContent className="bg-Background-A border-white/10">
          <DialogHeader>
            <DialogTitle className="text-Text-A">Return Item</DialogTitle>
            <DialogDescription className="text-Text-A/80">
              Select the condition of the returned item
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => handleReturn(ReturnCondition.BAIK)}
              disabled={isLoading}
              className="bg-green-500/10 text-green-500 hover:bg-green-500/20"
            >
              Good Condition
            </Button>
            <Button
              onClick={() => handleReturn(ReturnCondition.RUSAK)}
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
