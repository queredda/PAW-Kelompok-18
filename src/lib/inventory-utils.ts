import { getModels } from './models';
import { SeparatedInventoryItem } from '@/types/inventory';
import { RequestStatus, ReturnedCondition } from '@/models/LoanRequest';
import createHttpError from 'http-errors';

export async function inventorySeparator(id: string): Promise<SeparatedInventoryItem[]> {
  const { InventoryModel, LoanRequestModel } = getModels();

  const inventory = await InventoryModel.findOne({ id });
  if (!inventory) throw createHttpError(404, 'Inventory not found');

  const loanRequests = await LoanRequestModel.find({ inventoryId: id });
  const inventoryResponse: SeparatedInventoryItem[] = [];

  if (loanRequests.length === 0) {
    inventoryResponse.push({
      id: inventory.id,
      kondisi: ReturnedCondition.Baik,
      status: 'Available',
      kuantitas: inventory.totalKuantitas
    });
  } else {
    loanRequests.forEach((loanRequest) => {
      inventoryResponse.push({
        id: inventory.id,
        kondisi: loanRequest.isReturned && loanRequest.returnedCondition 
          ? loanRequest.returnedCondition 
          : ReturnedCondition.Baik,
        status: loanRequest.status === RequestStatus.Delivered ? 'Borrowed' : 'Available',
        kuantitas: loanRequest.kuantitas
      });
    });

    const editedInventoryResponse: SeparatedInventoryItem[] = [];

    // Group and sum quantities for each status/condition combination
    for (const item of inventoryResponse) {
      const index = editedInventoryResponse.findIndex(
        inv => inv.status === item.status && inv.kondisi === item.kondisi
      );

      if (index === -1) {
        editedInventoryResponse.push(item);
      } else {
        editedInventoryResponse[index].kuantitas += item.kuantitas;
      }
    }

    // Calculate available good condition items
    const totalKuantitas = inventory.totalKuantitas;
    const totalAvailableRusak = editedInventoryResponse.find(
      inv => inv.status === 'Available' && inv.kondisi === ReturnedCondition.Rusak
    )?.kuantitas || 0;
    const totalBorrowed = editedInventoryResponse.find(
      inv => inv.status === 'Borrowed' && inv.kondisi === ReturnedCondition.Baik
    )?.kuantitas || 0;

    const totalKeduanya = totalAvailableRusak + totalBorrowed;
    const totalAvailableBaik = totalKuantitas - totalKeduanya;

    if (totalAvailableBaik > 0) {
      editedInventoryResponse.push({
        id: inventory.id,
        kondisi: ReturnedCondition.Baik,
        status: 'Available',
        kuantitas: totalAvailableBaik
      });
    }

    return editedInventoryResponse;
  }

  return inventoryResponse;
} 