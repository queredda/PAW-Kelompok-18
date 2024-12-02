import './globals.css';
import { poppins } from '@/app/font';
import Providers from '../components/providers';
import { Toaster } from '@/components/ui/toaster';
import { Metadata } from 'next';

import { Navbar, Footer } from '@/components/global/ClientComponents';

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'BOX',
  description: 'Solution for your business',
};

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
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
      </body>
    </html>
  );
};

export default RootLayout;
