import { useRouter } from 'next/navigation';
import { PencilIcon } from 'lucide-react';
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
import { InventoryItem } from '@/types/inventory';
import { InventoryStatus } from '@prisma/client';

interface InventoryTableProps {
  items: InventoryItem[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-Text-A">Image</TableHead>
          <TableHead className="text-Text-A">Name</TableHead>
          <TableHead className="text-Text-A">Category</TableHead>
          <TableHead className="text-Text-A">Good Condition</TableHead>
          <TableHead className="text-Text-A">Damaged</TableHead>
          <TableHead className="text-Text-A">Total Borrowed</TableHead>
          <TableHead className="text-Text-A">Status</TableHead>
          <TableHead className="text-Text-A">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="h-12 w-12 relative">
                <Image
                  src={item.imageUrl || '/placeholder.svg'}
                  alt={item.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            </TableCell>
            <TableCell className="text-Text-A">{item.name}</TableCell>
            <TableCell className="text-Text-A">{item.kategori}</TableCell>
            <TableCell className="text-Text-A">
              <span className="inline-flex rounded-full px-4 py-1 text-xs font-semibold bg-green-500/10 text-green-500">
                {item.totalItemBaik}
              </span>
            </TableCell>
            <TableCell className="text-Text-A">
              <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-red-500/10 text-red-500">
                {item.totalItemRusak}
              </span>
            </TableCell>
            <TableCell className="text-Text-A">
              <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-yellow-500/10 text-yellow-500">
                {item.totalItemDipinjam}
              </span>
            </TableCell>
            <TableCell className="text-Text-A">
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                  item.status === InventoryStatus.Available
                    ? "bg-green-500/10 text-green-500"
                    : "bg-yellow-500/10 text-yellow-500"
                }`}
              >
                {item.status}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className={`h-8 w-8 ${
                    item.totalItemBaik === 0
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-Text-A hover:text-Background-A'
                  }`}
                  disabled={item.totalItemBaik === 0}
                  title={item.totalItemBaik === 0 ? 'No items available for loan' : 'Request loan'}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.totalItemBaik === 0) return;
                    
                    localStorage.setItem("selectedItem", JSON.stringify(item));
                    router.push("/employee/loan");
                  }}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
