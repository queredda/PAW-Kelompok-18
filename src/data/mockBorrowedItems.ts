import type { BorrowedItem } from "@/types/inventory"

export const mockBorrowedItems: BorrowedItem[] = [
  // Pending Items
  {
    trackingId: "#45169",
    product: { name: "iPhone 13", image: "/placeholder.svg" },
    customer: "Trixie Byrd",
    date: "15/06/2022",
    amount: 1149.95,
    status: "Pending"
  },
  {
    trackingId: "#45170",
    product: { name: "MacBook Pro", image: "/placeholder.svg" },
    customer: "John Smith",
    date: "18/06/2022",
    amount: 2149.95,
    status: "Pending"
  },
  // Delivered Items
  {
    trackingId: "#34304",
    product: { name: "Laptop Bag", image: "/placeholder.svg" },
    customer: "Brad Mason",
    date: "06/09/2022",
    amount: 899.95,
    status: "Delivered"
  },
  {
    trackingId: "#17188",
    product: { name: "Gaming Headset", image: "/placeholder.svg" },
    customer: "Sanderson",
    date: "25/09/2022",
    amount: 32.95,
    status: "Delivered"
  },
  // Returned Items
  {
    trackingId: "#17189",
    product: { name: "Wireless Mouse", image: "/placeholder.svg" },
    customer: "Emma Wilson",
    date: "28/09/2022",
    amount: 45.95,
    status: "Returned"
  },
  {
    trackingId: "#17190",
    product: { name: "Mechanical Keyboard", image: "/placeholder.svg" },
    customer: "Alex Johnson",
    date: "30/09/2022",
    amount: 129.95,
    status: "Returned"
  },
  // In Progress Items
  {
    trackingId: "#17191",
    product: { name: "Monitor", image: "/placeholder.svg" },
    customer: "Sarah Parker",
    date: "01/10/2022",
    amount: 349.95,
    status: "In Progress"
  },
  {
    trackingId: "#17192",
    product: { name: "Webcam", image: "/placeholder.svg" },
    customer: "Mike Thompson",
    date: "02/10/2022",
    amount: 89.95,
    status: "In Progress"
  }
] 