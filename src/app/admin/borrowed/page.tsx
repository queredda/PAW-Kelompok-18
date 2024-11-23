import { BorrowedItemsTable } from "@/components/borrowed-item-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { BorrowedItem } from "@/types/inventory"

const mockBorrowedItems: BorrowedItem[] = [
  {
    trackingId: "#20462",
    product: { name: "Hat", image: "/placeholder.svg" },
    customer: "Matt Dickerson",
    date: "13/05/2022",
    amount: 54.95,
    paymentMode: "Transfer Bank",
    status: "Delivered"
  },
  {
    trackingId: "#18933",
    product: { name: "Laptop", image: "/placeholder.svg" },
    customer: "Wiktoria",
    date: "22/05/2022",
    amount: 58.95,
    paymentMode: "Cash on Delivery",
    status: "Delivered"
  },
  {
    trackingId: "#45169",
    product: { name: "iPhone", image: "/placeholder.svg" },
    customer: "Trixie Byrd",
    date: "15/06/2022",
    amount: 1149.95,
    paymentMode: "Cash on Delivery",
    status: "Pending"
  },
  {
    trackingId: "#34304",
    product: { name: "Bag", image: "/placeholder.svg" },
    customer: "Brad Mason",
    date: "06/09/2022",
    amount: 899.95,
    paymentMode: "Transfer Bank",
    status: "Delivered"
  },
  {
    trackingId: "#17188",
    product: { name: "Headset", image: "/placeholder.svg" },
    customer: "Sanderson",
    date: "25/09/2022",
    amount: 32.95,
    paymentMode: "Cash on Delivery",
    status: "Delivered"
  }
]

export default function BorrowedItemsPage() {
  return (
    <div className="space-y-8 w-full min-h-screen bg-Background-A">
      <h1 className="text-2xl font-bold text-Text-A mb-6">Table of loan requests</h1>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-white">Show</span>
          <select className="bg-white/10 text-white border border-white/20 rounded-md">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span className="text-white">entries</span>
        </div>
        <div className="flex items-center space-x-2">
          <Input type="search" placeholder="Search..." className="bg-white/10 text-white" />
        </div>
      </div>
      <BorrowedItemsTable items={mockBorrowedItems} />
      <div className="flex justify-center space-x-2">
        <Button variant="outline">Previous</Button>
        <Button variant="outline">1</Button>
        <Button variant="outline">2</Button>
        <Button variant="outline">3</Button>
        <Button variant="outline">Next</Button>
      </div>
    </div>
  )
}

