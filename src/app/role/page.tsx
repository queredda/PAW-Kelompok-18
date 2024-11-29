'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function AccountTypeSelection() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const token = session?.accessToken
    if (token) {
      console.log('Role Page - JWT Token:', token);
    }
  }, [session]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  const patchRole = async (role: 'user' | 'admin') => {
    if (status !== 'authenticated' || !session?.accessToken) {
      alert('You must be logged in to perform this action');
      router.push('/login');
      return;
    }

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/role`,
        { role },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.accessToken}`
          },
          withCredentials: true
        }
      );
      router.push(`/register/${role === 'user' ? 'employee' : 'admin'}`);
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update role. Please try again.');
    }
  };

  return (
    <main>
      {/* Main Content */}
      <div className="flex justify-center items-center py-10 sm:py-20 px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#EA68AA] to-[#8F65BB] p-4 sm:p-8 rounded-xl shadow-lg flex flex-col lg:flex-row items-center max-w-4xl w-full gap-6 lg:gap-0">
          {/* Left Section */}
          <div className="flex-1 w-full">
            <h1 className="text-[28px] sm:text-[36px] font-bold text-white mb-6 text-center lg:text-left">
              Pilih tipe akunmu
            </h1>
            <div className="space-y-4 sm:space-y-6 flex flex-col items-center lg:items-start">
              {/* Updated Button untuk Karyawan */}
              <Button
                onClick={() => patchRole('user')}
                variant="secondary"
                className="w-full sm:w-3/4 bg-white text-[#AE66B5] hover:bg-white/90 rounded-full py-2 sm:py-3 text-base sm:text-lg font-medium bg-[#D9D9D9]"
              >
                Akun untuk karyawan
              </Button>

              {/* Updated Button untuk Admin Kantor */}
              <Button
                onClick={() => patchRole('admin')}
                variant="secondary"
                className="w-full sm:w-3/4 bg-white text-[#AE66B5] hover:bg-white/90 rounded-full py-2 sm:py-3 text-base sm:text-lg font-medium bg-[#D9D9D9]"
              >
                Akun untuk admin kantor
              </Button>

              {/* Button Kembali */}
              <Button
                onClick={() => router.push('/login')}
                variant="ghost"
                className="w-2/3 sm:w-1/3 py-2 text-white bg-[#413D79] hover:bg-white/10 rounded-full text-base sm:text-lg font-medium"
              >
                Kembali
              </Button>
            </div>
          </div>

          {/* Right Section - Logo shows below on mobile */}
          <div className="flex-1 flex justify-center items-center order-first lg:order-last">
            <Image
              src="/logo/LogoWhite.png"
              alt="Box Logo"
              width={220}
              height={300}
              className="h-auto w-[160px] sm:w-[180px] lg:w-[220px]"
              priority
            />
          </div>
        </div>
      </div>

      <div className="h-[50px] sm:h-[100px]"></div>
    </main>
  );
}
