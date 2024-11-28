"use client";

import { InventoryTable } from '@/components/inventory-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'

// const mockItems: InventoryItem[] = [
//   {
//     id: '#20462',
//     name: 'Hat',
//     category: 'Accessories',
//     location: 'Warehouse A',
//     quantity: 5,
//     image: '/placeholder.svg',
//     status: 'Available',
//   },
//   {
//     id: '#20463',
//     name: 'Laptop',
//     category: 'Electronics',
//     location: 'Warehouse B',
//     quantity: 10,
//     image: '/placeholder.svg',
//     status: 'Borrowed',
//   },
//   {
//     id: '#11351',
//     name: 'Iphone',
//     category: 'Electronics',
//     location: 'Warehouse B',
//     quantity: 10,
//     image: '/placeholder.svg',
//     status: 'Borrowed',
//   },
//   {
//     id: '#14124',
//     name: 'Android',
//     category: 'Electronics',
//     location: 'Warehouse B',
//     quantity: 10,
//     image: '/placeholder.svg',
//     status: 'Borrowed',
//   },
//   {
//     id: '#315351',
//     name: 'Meja',
//     category: 'Furniture',
//     location: 'Warehouse B',
//     quantity: 10,
//     image: '/placeholder.svg',
//     status: 'Borrowed',
//   },
//   {
//     id: '#352545',
//     name: 'Kursi',
//     category: 'Furniture',
//     location: 'Warehouse B',
//     quantity: 10,
//     image: '/placeholder.svg',
//     status: 'Borrowed',
//   },
//   {
//     id: '#542562',
//     name: 'Lemari',
//     category: 'Furniture',
//     location: 'Warehouse B',
//     quantity: 10,
//     image: '/placeholder.svg',
//     status: 'Borrowed',
//   },

// ];

export default function InventoryPage() {
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://api.boxsystem.site/admin/inventory"
        );
        setItems(response.data);
      } catch (err) {
        setError("Failed to fetch inventory data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.kategori.toLowerCase().includes(searchLower) ||
      item.kondisi.toLowerCase().includes(searchLower) ||
      item.status.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredItems.length / entriesPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );


  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleItemClick = () => {
    router.push('/employee/loan');
  };

  if (loading) {
    return <p className="text-white text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-8 w-full min-h-screen bg-Background-A p-4 md:p-8">
      <h1 className="text-xl md:text-2xl font-bold text-Text-A mb-4 md:mb-6 text-center">
        Table of Inventory
      </h1>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-Text-A text-sm md:text-base">Show</span>
          <select 
            className="bg-white/10 text-Text-A border border-white/20 rounded-md text-sm md:text-base px-2 py-1"
            value={entriesPerPage}
            onChange={handleEntriesChange}
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
          <span className="text-Text-A text-sm md:text-base">entries</span>
        </div>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full md:w-auto">
          <Input
            type="search"
            placeholder="Search..."
            className="bg-white/10 text-Text-A text-sm md:text-base w-full md:w-auto"
          />
          <Button asChild className="w-full md:w-auto text-Text-A bg-Secondary-A hover:bg-Secondary-A/80">
            <Link href="/admin/inventory/add">+ Add New Item</Link>
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <InventoryTable items={paginatedItems} />
      </div>
      <div className="flex justify-center gap-2 flex-wrap">
        <Button 
          variant="ghost" 
          className="text-Text-A hover:bg-Secondary-A hover:text-Text-A"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        > 
          <ChevronLeft />
        </Button>
        {[...Array(totalPages)].map((_, index) => (
          <Button
            key={index + 1}
            variant="default"
            className={`text-sm md:text-base ${
              currentPage === index + 1 ? 'bg-Secondary-A text-Text-A hover:bg-Secondary-A/80' : 'text-Text-A'
            } text-Text-A`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
        <Button 
          variant="ghost" 
          className="text-Text-A hover:bg-Secondary-A hover:text-Text-A"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
