"use client";

import { BorrowedItemsTable } from "@/components/borrowed-item-table"
import { Input } from "@/components/ui/input"
import { useState } from 'react';
import { mockBorrowedItems } from "@/data/mockBorrowedItems"

export default function BorrowedItemsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter items based on search query
  const filteredItems = mockBorrowedItems.filter(item => 
    item.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="space-y-8 w-full min-h-screen bg-Background-A p-4 md:p-8">
      <h1 className="text-xl md:text-2xl font-bold text-Text-A mb-4 md:mb-6 text-center">
        Table of Borrowed Items
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
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <BorrowedItemsTable 
          items={paginatedItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
