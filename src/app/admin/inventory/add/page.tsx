import { AddItemForm } from "@/components/add-item-form"

export default function AddNewItemPage() {
  return (
    <div className="space-y-8 w-full px-[120px] bg-Background-A">
      <h1 className="text-2xl font-bold text-Text-A mb-6">Add new item to inventory</h1>
      <AddItemForm />
    </div>
  )
}
