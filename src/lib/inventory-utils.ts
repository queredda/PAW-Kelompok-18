import { getModels } from './models';
import { SeparatedInventoryItem } from '@/types/inventory';
import { LoanRequest, RequestStatus } from '@/types/request';

export async function inventorySeparator(inventoryId: string | number) {
  const { InventoryModel, LoanRequestModel } = getModels();

  const inventory = await InventoryModel.findOne({
    id: Number(inventoryId),
  });

  if (!inventory) return [];

  // Type the loan requests
  const loanRequests = (await LoanRequestModel.find({
    inventoryId: Number(inventoryId),
    status: {
      $in: ['Delivered', 'Canceled'] as RequestStatus[],
    },
  })) as unknown as LoanRequest[];

  const totalLoaned = loanRequests
    .filter((request) => request.status === 'Delivered')
    .reduce((acc, request) => acc + (request.kuantitas || 0), 0);

  const totalBadCondition = loanRequests
    .filter(
      (request) =>
        request.status === 'Canceled' && request.returnedCondition === 'rusak'
    )
    .reduce((acc, request) => acc + (request.kuantitas || 0), 0);

  const separatedItems: SeparatedInventoryItem[] = [
    {
      id: inventory.id,
      name: inventory.name,
      kondisi: 'baik',
      kuantitas: inventory.totalKuantitas - totalLoaned - totalBadCondition,
      status: 'Available',
      kategori: inventory.kategori,
    },
  ];

  if (totalLoaned > 0) {
    separatedItems.push({
      id: inventory.id,
      name: inventory.name,
      kondisi: 'baik',
      kuantitas: totalLoaned,
      status: 'Borrowed',
      kategori: inventory.kategori,
    });
  }

  if (totalBadCondition > 0) {
    separatedItems.push({
      id: inventory.id,
      name: inventory.name,
      kondisi: 'rusak',
      kuantitas: totalBadCondition,
      status: 'Available',
      kategori: inventory.kategori,
    });
  }

  return separatedItems;
}
