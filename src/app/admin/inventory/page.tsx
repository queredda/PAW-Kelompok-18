'use client';

import { InventoryTable } from '@/components/inventory-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { InventoryItem } from '@/types/inventory';
import { Skeleton } from '@/components/ui/skeleton';

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await api.get('/admin/inventory');
        console.log('Inventory response:', response.data);
        setItems(response.data);
      } catch (err: Error | unknown) {
        const error = err as Error;
        setError(
          'message' in error ? error.message : 'Failed to fetch inventory data.'
        );
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

  if (loading) {
    return (
      <div className="space-y-8 w-full min-h-screen bg-Background-A p-4 md:p-8">
        <Skeleton className="h-8 w-64 mx-auto bg-white/10" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-32 bg-white/10" />
          <Skeleton className="h-10 w-48 bg-white/10" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, idx) => (
            <Skeleton key={idx} className="h-16 w-full bg-white/10" />
          ))}
        </div>
        <div className="flex justify-center gap-2">
          {[...Array(3)].map((_, idx) => (
            <Skeleton key={idx} className="h-10 w-10 bg-white/10" />
          ))}
        </div>
      </div>
    );
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
            value={searchTerm}
            onChange={handleSearch}
          />
          <Button
            asChild
            className="w-full md:w-auto text-Text-A bg-Secondary-A hover:bg-Secondary-A/80"
          >
            <Link href="/admin/inventory/add">+ Add New Item</Link>
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        {error || items.length === 0 ? (
          <div className="h-[50vh] flex items-center justify-center">
            <p className="text-Text-A text-xl">
              {error || 'No available item'}
            </p>
          </div>
        ) : (
          <InventoryTable items={paginatedItems} />
        )}
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
        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNumber = index + 1;
          return (
            <Button
              key={`page-${pageNumber}`}
              variant="default"
              className={`text-sm md:text-base ${
                currentPage === pageNumber
                  ? 'bg-Secondary-A text-Text-A hover:bg-Secondary-A/80'
                  : 'text-Text-A'
              } text-Text-A`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </Button>
          );
        })}
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
