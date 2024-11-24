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
import type { InventoryItem } from "@/types/inventory"

interface InventoryTableProps {
  items: InventoryItem[]
}

export function InventoryTable({ items }: InventoryTableProps) {
  return (
    <div className="rounded-md border border-white/10 bg-white/5 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-Text-A min-w-[100px]">Items ID</TableHead>
            <TableHead className="text-Text-A min-w-[150px]">Items</TableHead>
            <TableHead className="text-Text-A min-w-[120px]">Category</TableHead>
            <TableHead className="text-Text-A min-w-[100px]">Status</TableHead>
            <TableHead className="text-Text-A min-w-[120px]">Location</TableHead>
            <TableHead className="text-Text-A min-w-[100px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="border-white/5">
              <TableCell className="font-medium text-Text-A">{item.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="h-8 w-8 rounded-full"
                    width={32}
                    height={32}
                  />
                  <span className="text-Text-A">{item.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-Text-A">{item.category}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    item.status === "Available"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-yellow-500/10 text-yellow-500"
                  }`}
                >
                  {item.status}
                </span>
              </TableCell>
              <TableCell className="text-Text-A">{item.location}</TableCell>
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
  )
}
