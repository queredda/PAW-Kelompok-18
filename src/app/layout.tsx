'use client';

import './globals.css';
import { poppins } from '@/app/font';
import dynamic from 'next/dynamic';
import Providers from '../components/providers';
import { Toaster } from '@/components/ui/toaster';
import { SessionProvider } from 'next-auth/react';

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
        <SessionProvider>
          <Providers>
            <Navbar />
            <main
              className={`py-[150px] md:px-[120px] bg-Background-A overflow-hidden`}
            >
              {children}
            </main>
            <Toaster />
            <Footer />
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
