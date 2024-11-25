"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Footer from "@/components/global/Footer"

export default function AccountTypeSelection() {
  const router = useRouter();

  return (
    <main>

        {/* Main Content */}
        <div className="flex justify-center items-center py-20">
        <div className="bg-gradient-to-br from-[#EA68AA] to-[#8F65BB] p-8 rounded-xl shadow-lg flex items-center max-w-4xl w-full">
            {/* Left Section */}
            <div className="flex-1">
            <h1 className="text-[36px] font-bold text-white mb-6">
                Pilih tipe akunmu
            </h1>
            <div className="space-y-6">
                {/* Button untuk Karyawan */}
                <Button
                onClick={() => router.push("/landing/register/employee")}
                variant="secondary"
                className="w-3/4 bg-white text-[#AE66B5] hover:bg-white/90 rounded-full py-3 text-lg font-medium bg-[#D9D9D9]"
                >
                Akun untuk karyawan
                </Button>

                {/* Button untuk Admin Kantor */}
                <Button
                onClick={() => router.push("/landing/register/admin")}
                variant="secondary"
                className="w-3/4 bg-white text-[#AE66B5] hover:bg-white/90 rounded-full py-3 text-lg font-medium bg-[#D9D9D9]"
                >
                Akun untuk admin kantor
                </Button>

                {/* Button Kembali */}
                <Button
                onClick={() => router.push("/landing/login")}
                variant="ghost"
                className="w-1/3 py-2 text-white bg-[#413D79] hover:bg-white/10 rounded-full py-3 text-lg font-medium"
                >
                Kembali
                </Button>
            </div>
            </div>

            {/* Right Section */}
            <div className="flex-1 flex justify-center items-center">
            <Image
                src="/logo/LogoWhite.png"
                alt="Box Logo"
                width={220}
                height={300}
                className="h-auto max-w-[220px]"
                priority
            />
            </div>
        </div>
        </div>

        <div className="h-[100px]"></div>


    </main>
  )   
}
