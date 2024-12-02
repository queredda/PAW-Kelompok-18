import { useState } from 'react';
import { Trash2Icon } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { InventoryItem } from '@/types/inventory';

interface InventoryTableProps {
  items: InventoryItem[];
  onDelete?: (id: string) => void;
}

export function InventoryTable({ items, onDelete }: InventoryTableProps) {
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteClick = (id: string) => {
    setDeleteItemId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteItemId && onDelete) {
      onDelete(deleteItemId);
    }
    setIsDeleteDialogOpen(false);
    setDeleteItemId(null);
  };

  return (
    <>
      <div className="w-full overflow-auto">
        <div className="rounded-md border border-white/5 bg-white/5 min-w-[800px]">
          <Table>
            <TableHeader>
              <TableRow className="border-white/20">
                <TableHead className="text-Text-A whitespace-nowrap">ID</TableHead>
                <TableHead className="text-Text-A whitespace-nowrap">Item</TableHead>
                <TableHead className="text-Text-A whitespace-nowrap">Category</TableHead>
                <TableHead className="text-Text-A whitespace-nowrap">Total Quantity</TableHead>
                <TableHead className="text-Text-A whitespace-nowrap">Good Condition</TableHead>
                <TableHead className="text-Text-A whitespace-nowrap">Damaged</TableHead>
                <TableHead className="text-Text-A whitespace-nowrap">Status</TableHead>
                <TableHead className="text-Text-A whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="border-white/5">
                  <TableCell className="font-medium text-Text-A max-w-[100px] truncate">
                    {item.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="relative h-8 w-8 shrink-0">
                        <Image
                          src={item.imageUrl || '/placeholder.svg'}
                          alt={item.name}
                          className="rounded-full object-cover"
                          fill
                          sizes="32px"
                        />
                      </div>
                      <span className="text-Text-A truncate">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-Text-A whitespace-nowrap">{item.kategori}</TableCell>
                  <TableCell className="text-Text-A whitespace-nowrap">
                    {item.totalKuantitas}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex rounded-full px-4 py-1 text-xs font-semibold bg-green-500/10 text-green-500 whitespace-nowrap">
                      {item.totalItemBaik || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-red-500/10 text-red-500 whitespace-nowrap">
                      {item.totalItemRusak || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold whitespace-nowrap ${
                        item.status === 'Available'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-yellow-500/10 text-yellow-500'
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {onDelete && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-500 hover:bg-red-500/20"
                          onClick={() => handleDeleteClick(item.id)}
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
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-Background-A border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-Text-A">
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-Text-A/80">
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-Background-D text-Text-A hover:bg-Background-D/80">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
