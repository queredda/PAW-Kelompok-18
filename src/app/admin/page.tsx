// page.tsx
"use client";
import { useState, useEffect } from 'react';
import { StatsCards } from '@/components/stats-cards';
import { BackgroundBlur } from '@/components/background-blur';
import type { Stats } from '@/types/inventory';

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch('https://api.boxsystem.site/admin/stats');
      const data: Stats = await response.json();
      setStats(data);
    };
    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="relative space-y-8 w-full min-h-screen bg-Background-A">
        <BackgroundBlur />
        <h1 className="text-2xl font-bold text-Text-A text-center mb-6">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="relative space-y-8 w-full min-h-screen bg-Background-A">
      <BackgroundBlur />
      <h1 className="text-2xl font-bold text-Text-A text-center mb-6">Inventory Statistics</h1>
      <StatsCards stats={stats} />
    </div>
  );
}