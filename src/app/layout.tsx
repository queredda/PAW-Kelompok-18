'use client';

import './globals.css';
import React from 'react';
import { poppins } from "@/app/font";
import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/toaster";


const Navbar = dynamic(() => import("@/components/global/Navbar"), {
  ssr: false,
});
const Footer = dynamic(() => import("@/components/global/Footer"), {
  ssr: false,
});

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
          <Navbar />
          <Toaster />
          <main className={`py-[100px] md:px-[120px] bg-Background-A`}>
            {children}
        </main>
          <Footer />
      </body>
    </html>
  );
};

export default RootLayout;