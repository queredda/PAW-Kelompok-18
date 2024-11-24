import React from 'react'
import { InventoryTable } from "@/components/inventory-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { InventoryItem } from "@/types/inventory"
import Link from "next/link"

const mockItems: InventoryItem[] = [
  {
    id: "#20462",
    name: "Hat",
    category: "Accessories",
    location: "Warehouse A",
    quantity: 5,
    image: "/placeholder.svg",
    status: "Available",
  },
  {
    id: "#20463",
    name: "Laptop",
    category: "Electronics",
    location: "Warehouse B",
    quantity: 10,
    image: "/placeholder.svg",
    status: "Borrowed",
  },
    {
     id: "#32322",
    name: "Kentang",
    category: "Electronics",
    location: "Warehouse B",
    quantity: 10,
    image: "/placeholder.svg",
    status: "Borrowed", 
  },
]

const page = () => {
  return (
    <div className="space-y-8 w-full min-h-screen bg-Background-A">
      <h1 className="text-2xl font-bold text-Text-A mb-6">Table of Inventory</h1>
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
          <Button asChild>
            <Link href="/inventory/add">+ Add New Item</Link>
          </Button>
        </div>
      </div>
      <InventoryTable items={mockItems} />
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

export default page