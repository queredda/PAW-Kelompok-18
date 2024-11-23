"use client";

import { PencilIcon, TrashIcon } from 'lucide-react'
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { BorrowedItem } from "@/types/inventory"

interface BorrowedItemsTableProps {
  items: BorrowedItem[]
}

export function BorrowedItemsTable({ items }: BorrowedItemsTableProps) {
  return (
    <Tabs defaultValue="loan-requests" className="w-full flex flex-col min-h-[500px]">
      <TabsList className="bg-transparent w-full h-fit font-pop flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6 justify-start p-4">
        <TabsTrigger value="loan-requests" className="font-pop text-sm sm:text-base text-gray-500 data-[state=active]:text-Text-A data-[state=active]:font-bold data-[state=active]:underline data-[state=active]:bg-Background-A">Loan Requests</TabsTrigger>
        <TabsTrigger value="borrowed" className="font-pop text-sm sm:text-base text-gray-500 data-[state=active]:text-Text-A data-[state=active]:font-bold data-[state=active]:underline data-[state=active]:bg-Background-A">Borrowed Items</TabsTrigger>
        <TabsTrigger value="to-return" className="font-pop text-sm sm:text-base text-gray-500 data-[state=active]:text-Text-A data-[state=active]:font-bold data-[state=active]:underline data-[state=active]:bg-Background-A">Items to Return</TabsTrigger>
      </TabsList>

      <TabsContent value="loan-requests" className="mt-2 sm:mt-3 md:mt-4">
        <div className="rounded-md border border-white/10 bg-white/5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-Text-A font-pop">Tracking ID</TableHead>
                <TableHead className="text-Text-A font-pop">Product</TableHead>
                <TableHead className="text-Text-A font-pop">Customer</TableHead>
                <TableHead className="text-Text-A font-pop">Date</TableHead>
                <TableHead className="text-Text-A font-pop">Amount</TableHead>
                <TableHead className="text-Text-A font-pop">Payment Mode</TableHead>
                <TableHead className="text-Text-A font-pop">Status</TableHead>
                <TableHead className="text-Text-A font-pop">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.filter(item => item.status === "Pending").map((item) => (
                <TableRow key={item.trackingId} className="border-white/5">
                  <TableCell className="font-medium text-Text-A font-pop">{item.trackingId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-8 w-8 rounded-full"
                        width={32}
                        height={32}
                      />
                      <span className="text-Text-A font-pop">{item.product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-Text-A font-pop">{item.customer}</TableCell>
                  <TableCell className="text-Text-A font-pop">{item.date}</TableCell>
                  <TableCell className="text-Text-A font-pop">${item.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-Text-A font-pop">{item.paymentMode}</TableCell>
                  <TableCell>
                    <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-yellow-500/10 text-yellow-500 font-pop">
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-Text-A">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-Text-A">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="borrowed" className="mt-2 sm:mt-3 md:mt-4">
        <div className="rounded-md border border-white/10 bg-white/5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-Text-A font-pop">Tracking ID</TableHead>
                <TableHead className="text-Text-A font-pop">Product</TableHead>
                <TableHead className="text-Text-A font-pop">Customer</TableHead>
                <TableHead className="text-Text-A font-pop">Date</TableHead>
                <TableHead className="text-Text-A font-pop">Amount</TableHead>
                <TableHead className="text-Text-A font-pop">Payment Mode</TableHead>
                <TableHead className="text-Text-A font-pop">Status</TableHead>
                <TableHead className="text-Text-A font-pop">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.filter(item => item.status === "Delivered").map((item) => (
                <TableRow key={item.trackingId} className="border-white/5">
                  <TableCell className="font-medium text-Text-A font-pop">{item.trackingId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-8 w-8 rounded-full"
                        width={32}
                        height={32}
                      />
                      <span className="text-Text-A font-pop">{item.product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-Text-A font-pop">{item.customer}</TableCell>
                  <TableCell className="text-Text-A font-pop">{item.date}</TableCell>
                  <TableCell className="text-Text-A font-pop">${item.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-Text-A font-pop">{item.paymentMode}</TableCell>
                  <TableCell>
                    <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-green-500/10 text-green-500 font-pop">
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-Text-A">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-Text-A">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="to-return" className="mt-2 sm:mt-3 md:mt-4">
        <div className="rounded-md border border-white/10 bg-white/5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-Text-A font-pop">Tracking ID</TableHead>
                <TableHead className="text-Text-A font-pop">Product</TableHead>
                <TableHead className="text-Text-A font-pop">Customer</TableHead>
                <TableHead className="text-Text-A font-pop">Date</TableHead>
                <TableHead className="text-Text-A font-pop">Amount</TableHead>
                <TableHead className="text-Text-A font-pop">Payment Mode</TableHead>
                <TableHead className="text-Text-A font-pop">Status</TableHead>
                <TableHead className="text-Text-A font-pop">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.filter(item => item.status === "Delivered").map((item) => (
                <TableRow key={item.trackingId} className="border-white/5">
                  <TableCell className="font-medium text-Text-A font-pop">{item.trackingId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-8 w-8 rounded-full"
                        width={32}
                        height={32}
                      />
                      <span className="text-Text-A font-pop">{item.product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-Text-A font-pop">{item.customer}</TableCell>
                  <TableCell className="text-Text-A font-pop">{item.date}</TableCell>
                  <TableCell className="text-Text-A font-pop">${item.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-Text-A font-pop">{item.paymentMode}</TableCell>
                  <TableCell>
                    <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-green-500/10 text-green-500 font-pop">
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-Text-A">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-Text-A">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  )
}
