'use client';

import './globals.css';
import React from 'react';
import { poppins } from '@/app/font';
import dynamic from 'next/dynamic';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from "./providers";

const Navbar = dynamic(() => import('@/components/global/Navbar'), {
  ssr: false,
});
const Footer = dynamic(() => import('@/components/global/Footer'), {
  ssr: false,
});

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        <Providers>
          <Navbar />
          <Toaster />
          <main className={`py-[150px] md:px-[120px] bg-Background-A overflow-hidden`}>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
