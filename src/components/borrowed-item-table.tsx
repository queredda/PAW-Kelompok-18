'use client';

import { PencilIcon } from 'lucide-react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { BorrowedItem } from '@/types/inventory';

interface BorrowedItemsTableProps {
  items: BorrowedItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function BorrowedItemsTable({ items, currentPage, totalPages, onPageChange }: BorrowedItemsTableProps) {
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
            <TableHead className="text-Text-A font-pop">Status</TableHead>
            {status !== 'Delivered' && (
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
                <TableCell>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold font-pop ${
                      status === 'Pending'
                        ? 'bg-yellow-500/10 text-yellow-500'
                        : 'bg-green-500/10 text-green-500'
                    }`}
                  >
                    {item.status}
                  </span>
                </TableCell>
                {status !== 'Delivered' && (
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-Text-A hover:bg-Secondary-A/20"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-Background-A border-white/10">
                        <DialogHeader>
                          <DialogTitle className="text-Text-A text-[16px] font-pop">
                            {status === 'Returned' ? 'Terima Pengembalian Barang, bagaimana kondisinya?' : 'Terima Permintaan Peminjaman?'}
                          </DialogTitle>
                          <DialogDescription className="text-Text-A/80 font-pop text-[14px]">
                            {status === 'Returned' ? 'Pilih kondisi barang yang dikembalikan' : 'Peminjam akan menerima status barang disetujui untuk dipinjam'}
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex gap-2">
                          {status === 'Returned' ? (
                            <>
                              <Button
                                variant="ghost"
                                className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-Text-A font-pop"
                              >
                                Baik
                              </Button>
                              <Button
                                variant="ghost"
                                className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-Text-A font-pop"
                              >
                                Rusak
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-Text-A font-pop"
                              >
                                Accept Request
                              </Button>
                              <Button
                                variant="ghost"
                                className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-Text-A font-pop"
                              >
                                Reject Request
                              </Button>
                            </>
                          )}
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
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
          value="to-return"
          className="font-pop text-sm sm:text-base text-gray-500 data-[state=active]:text-Text-A data-[state=active]:font-bold data-[state=active]:underline data-[state=active]:bg-Background-A"
        >
          Items to Return
        </TabsTrigger>
      </TabsList>

      <TabsContent value="loan-requests" className="mt-2 md:mt-4">
        {renderTableContent('Pending')}
      </TabsContent>

      <TabsContent value="borrowed" className="mt-2 md:mt-4">
        {renderTableContent('Delivered')}
      </TabsContent>

      <TabsContent value="to-return" className="mt-2 md:mt-4">
        {renderTableContent('Returned')}
      </TabsContent>

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
              currentPage === index + 1 ? 'bg-Secondary-A text-Text-A hover:bg-Secondary-A/80' : 'text-Text-A'
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
  );
}
