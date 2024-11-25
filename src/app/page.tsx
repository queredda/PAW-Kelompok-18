"use client";

import React from "react";
import { TbFolderSearch } from "react-icons/tb";
import { SlHandbag } from "react-icons/sl";
import { FiFileText } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


const Home: React.FC = () => {
  const router = useRouter();

  return  <main>

    {/* Hero Section */}
    <section className="container mx-auto px-20">
      <div className="flex flex-col-reverse items-center justify-between gap-16 py-16 lg:flex-row">
        <div className="max-w-xl lg:pl-12">
          <p className="font-poppins text-[36px] font-semibold leading-tight text-white">
            Track and Manage Your Company’s Assets with Ease</p>
          <p className="mb-8 text-[15px] pt-5 font-poppins text-base leading-relaxed text-white">
              Platform kami menawarkan solusi intuitif untuk melacak dan mengelola aset
              perusahaan Anda secara efisien. Dari pengendalian inventaris hingga proses
              peminjaman yang lebih mudah, sistem kami menyederhanakan manajemen aset
              hanya dengan beberapa klik. Baik Anda seorang admin yang mengawasi
              operasional atau karyawan yang mengelola peminjaman aset pribadi, alat ini
              dirancang untuk memenuhi kebutuhan setiap pengguna.</p>
          <div className="flex flex-col gap-4 sm:flex-row">
              <Button 
                onClick={() => router.push("/register")}
                className="rounded-[20px] bg-[#EA68AA] px-12 py-3 font-poppins text-[18px] font-semibold text-white transition-opacity hover:opacity-90">
                Mendaftar
              </Button>
              <Button 
                onClick={() => router.push("/login")}
                className="rounded-[20px] bg-[#8F65BB] px-12 py-3 font-poppins text-[18px] font-semibold text-white transition-opacity hover:opacity-90">
                Masuk
              </Button>
          </div>   
        </div>
        <div className="w-full max-w-sm lg:w-1/2">
          <div className="relative aspect-square lg:pt-8">
            <img
                src="logo/Logo.png" alt="rectangle" width="255" height="290" className="w-full h-auto m-0 block max-w-[255px]"/>
          </div>
        </div>  
      </div>
    </section>
  
    {/* Features Section */}
    <section className="container mx-auto px-4 py-24">
      <h2 className="mb-12 text-center font-poppins text-3xl font-semibold text-white">
        Fitur Platform
      </h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature Card 1 */}
          <div className="rounded-2xl bg-gradient-to-br from-[#EA68AA] to-[#8F65BB] p-8 shadow-lg transition-transform hover:-translate-y-1">
            <div className="mb-4 flex justify-center">
              <TbFolderSearch className="h-12 w-12 text-white"/>
            </div>
            <h3 className="mb-3 text-center font-poppins text-xl font-semibold text-white">
              Pelacakan Inventaris Secara Real-Time
            </h3>
            <p className="text-center font-poppins text-sm text-white/90">
              Pantau status seluruh aset perusahaan, mulai dari aset yang tersedia hingga aset yang sedang dipinjam.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="rounded-2xl bg-gradient-to-br from-[#8F65BB] to-[#EA68AA] p-8 shadow-lg transition-transform hover:-translate-y-1">
            <div className="mb-4 flex justify-center">
            <SlHandbag className="h-12 w-12 text-white" />
            </div>
            <h3 className="mb-3 text-center font-poppins text-xl font-semibold text-white">
              Proses Peminjaman dan Pengembalian yang Sederhana
            </h3>
            <p className="text-center font-poppins text-sm text-white/90">
              Karyawan dapat dengan cepat meminjam aset yang dibutuhkan dan admin dapat dengan cepat mendapat notifikasi terkait semua aktivitas.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="rounded-2xl bg-gradient-to-br from-[#EA68AA] to-[#8F65BB] p-8 shadow-lg transition-transform hover:-translate-y-1">
            <div className="mb-4 flex justify-center">
            <FiFileText className="h-12 w-12 text-white" />
            </div>
            <h3 className="mb-3 text-center font-poppins text-xl font-semibold text-white">
              Laporan yang Komprehensif
            </h3>
            <p className="text-center font-poppins text-sm text-white/90">
              Dapatkan wawasan mendalam dengan laporan lengkap mengenai inventaris, riwayat peminjaman, dan kondisi aset.
            </p>
          </div>
      </div>
    </section>
    <div className="h-[100px]"></div>

  </main>
};

export default Home;