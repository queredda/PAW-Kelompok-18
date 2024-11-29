import { PencilIcon, Trash2Icon } from 'lucide-react';
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
  onDelete?: (id: number) => void
}

export function InventoryTable({ items, onDelete }: InventoryTableProps) {
  return (
    <div className="rounded-md border border-white/5 bg-white/5 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-white/20">
            <TableHead className="text-Text-A">ID</TableHead>
            <TableHead className="text-Text-A">Item</TableHead>
            <TableHead className="text-Text-A">Category</TableHead>
            <TableHead className="text-Text-A">Total Quantity</TableHead>
            <TableHead className="text-Text-A">Available</TableHead>
            <TableHead className="text-Text-A">Damaged</TableHead>
            <TableHead className="text-Text-A">Status</TableHead>
            <TableHead className="text-Text-A">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="border-white/5">
              <TableCell className="font-medium text-Text-A">
                {item.id}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-8 w-8 rounded-full"
                    width={32}
                    height={32}
                  />
                  <span className="text-Text-A">{item.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-Text-A">
                {item.kategori}
              </TableCell>
              <TableCell className="text-Text-A">
                {item.totalKuantitas}
              </TableCell>
              <TableCell className="text-Text-A">
                {item.availableQuantity || item.totalKuantitas}
              </TableCell>
              <TableCell>
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                  item.damagedQuantity ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                }`}>
                  {item.damagedQuantity || 0}
                </span>
              </TableCell>
              <TableCell>
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                  item.status === "Available"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-yellow-500/10 text-yellow-500"
                }`}>
                  {item.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-Text-A"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  {onDelete && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={() => onDelete(item.id)}
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
