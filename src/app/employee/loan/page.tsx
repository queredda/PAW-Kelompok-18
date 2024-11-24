"use client"

import React, {useState} from 'react'
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

const Page = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string); // Mengatur preview gambar
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null); // Menghapus gambar
  };

  return (
    <div className="space-y-8 w-full min-h-screen bg-Background-A px-[40px] md:px-8 py-4 sm:py-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-Text-A mb-6">
        Item loan form
      </h1>
      <Card className="bg-gradient-to-r from-[#EA68AA] via-[#8B5799] to-[#264491] w-full max-w-[1065px] mx-auto p-2 sm:p-4 gap-x-2">
        <CardContent className="flex flex-row items-center justify-center gap-4 sm:gap-8">
          <div className="relative w-full max-w-[436px] ">
            <p className="text-[#D9D9D9] text-[36px] mb-3">
              Formulir Peminjaman
            </p>
            <div className="flex-col">
              <div className="flex items-center space-x-2 mb-3">
                <input type="text" placeholder="Nama item" className="text-[15px] placeholder:text-[#CF67AF] text-[#CF67AF] bg-[#D9D9D9] h-[44px] w-full max-w-[433px] rounded-[30px] px-4 py-1 focus-visible:outline-none"/>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <input type="text" placeholder="Kategori item" className="text-[15px] placeholder:text-[#CF67AF] text-[#CF67AF] bg-[#D9D9D9] h-[44px] w-full max-w-[433px] rounded-[30px] px-4 py-1 focus-visible:outline-none"/>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <input type="text" placeholder="Kuantitas item" className="text-[15px] placeholder:text-[#CF67AF] text-[#CF67AF] bg-[#D9D9D9] h-[44px] w-full max-w-[433px] rounded-[30px] px-4 py-1 focus-visible:outline-none"/>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <input type="text" placeholder="Durasi peminjaman" className="text-[15px] placeholder:text-[#CF67AF] text-[#CF67AF] bg-[#D9D9D9] h-[44px] w-full max-w-[433px] rounded-[30px] px-4 py-1 focus-visible:outline-none"/>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <input type="text" placeholder="Masukkan password akun anda" className="text-[15px] placeholder:text-[#CF67AF] text-[#CF67AF] bg-[#D9D9D9] h-[44px] w-full max-w-[433px] rounded-[30px] px-4 py-1 focus-visible:outline-none"/>
              </div>
            </div>
            <div>
              <Button
              variant="secondary"
              size="sm"
              className="text-[10px] sm:text-[20px] whitespace-nowrap bg-[#413D79] h-[44px] w-full max-w-[267px] rounded-[30px] text-[#D9D9D9]"
              >
              Ajukan Peminjaman
            </Button>
            </div>
          </div>
          <div className="flex-col w-full max-w-[433px]">
            <div className="relative h-[402px] flex justify-center items-center bg-[#D9D9D9] rounded-3xl mb-3">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt="Preview"
                  fill
                  className="object-contain rounded-3xl"
                />
              ) : (
                <p className="text-[#CF67AF] text-[15px]">Anda belum memilih item apapun</p>
              )}
            </div>
            <div className="flex flex-row items-center gap-x-3">
              <label
                htmlFor="fileInput"
                className="cursor-pointer px-6 py-2 rounded-lg bg-[#413D79] text-[#D9D9D9] text-sm font-semibold hover:bg-[#8B5799] transition duration-200 ease-in-out"
              >
                Pilih Gambar
              </label>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {selectedImage && (
                <button
                  onClick={handleRemoveImage}
                  className="px-6 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition duration-200 ease-in-out "
                >
                  Hapus Gambar
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Page
