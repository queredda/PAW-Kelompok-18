import prisma from '@/lib/prisma';
import { SeparatedInventoryItem } from '@/types/inventory';
import { InventoryStatus, LoanStatus, ReturnCondition } from '@prisma/client';

export async function inventorySeparator(inventoryId: string) {
  try {
    const inventory = await prisma.inventory.findUnique({
      where: { id: inventoryId }
    });

    if (!inventory) return [];

    const loanRequests = await prisma.loanRequest.findMany({
      where: {
        inventoryId,
        status: {
          in: [LoanStatus.DELIVERED, LoanStatus.COMPLETED]
        }
      }
    });

    const totalLoaned = loanRequests
      .filter(request => request.status === LoanStatus.DELIVERED)
      .reduce((acc, request) => acc + request.kuantitas, 0);

    const totalBadCondition = loanRequests
      .filter(
        request =>
          request.status === LoanStatus.COMPLETED && 
          request.returnedCondition === ReturnCondition.RUSAK
      )
      .reduce((acc, request) => acc + request.kuantitas, 0);

    const separatedItems: SeparatedInventoryItem[] = [
      {
        id: inventory.id,
        name: inventory.name,
        kondisi: 'BAIK',
        kuantitas: inventory.totalKuantitas - totalLoaned - totalBadCondition,
        status: 'Available',
        kategori: inventory.kategori,
      }
    ];

    if (totalLoaned > 0) {
      separatedItems.push({
        id: inventory.id,
        name: inventory.name,
        kondisi: 'BAIK',
        kuantitas: totalLoaned,
        status: InventoryStatus.Unavailable,
        kategori: inventory.kategori,
      });
    }

    if (totalBadCondition > 0) {
      separatedItems.push({
        id: inventory.id,
        name: inventory.name,
        kondisi: 'RUSAK',
        kuantitas: totalBadCondition,
        status: 'Available',
        kategori: inventory.kategori,
      });
    }

    return separatedItems;
  } catch (error) {
    console.error('Inventory separation error:', error);
    throw error;
  }
}
