'use client';

import { useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function AddItemForm() {
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  return (
    <Card className="bg-gradient-to-br from-Linear-A-from to-Linear-A-to text-Text-A border-none px-4 sm:px-10 py-3 sm:py-5 w-full max-w-[95vw] mx-auto">
      <CardContent className="p-3 sm:p-6">
        <h2 className="text-[24px] sm:text-[30px] font-semibold font-pop mb-4 sm:mb-6 text-center sm:text-left">
          Daftarkan item baru
        </h2>
        <div className="flex flex-col-reverse sm:grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3 sm:space-y-4 w-full">
            <div>
              <Input
                id="name"
                placeholder="Nama item"
                className="bg-Input-A mt-1 text-Text-D rounded-[30px] px-4 w-full"
              />
            </div>
            <div>
              <Input
                id="category"
                placeholder="Kategori item"
                className="bg-Input-A mt-1 text-Text-D rounded-[30px] px-4 w-full"
              />
            </div>
            <div>
              <Input
                id="location"
                placeholder="Lokasi Penyimpanan"
                className="bg-Input-A mt-1 text-Text-D rounded-[30px] px-4 w-full"
              />
            </div>
            <div>
              <Input
                id="quantity"
                type="number"
                placeholder="Kuantitas item"
                className="bg-Input-A mt-1 text-Text-D rounded-[30px] px-4 w-full"
              />
            </div>
            <div>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="bg-Input-A mt-1 text-Text-D rounded-[30px] px-4 w-full"
              />
            </div>
            <div>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password akun anda"
                className="bg-Input-A mt-1 text-Text-D rounded-[30px] px-4 w-full"
              />
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Button className="w-full sm:w-auto px-[40px] bg-[#413D79] hover:bg-[#413D79]/80 rounded-[30px]">
                Daftar
              </Button>
              {image && (
                <Button
                  onClick={handleRemoveImage}
                  className="px-4 bg-red-500 hover:bg-red-600 rounded-full"
                >
                  <X className="h-4 w-4" /> Hapus Gambar
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center bg-white/10 rounded-[30px] overflow-hidden mb-4 sm:mb-0 h-[200px] sm:h-[300px]">
            {image ? (
              <div className="relative w-full h-full">
                <Image
                  src={image}
                  alt="Preview"
                  className="object-contain"
                  fill
                  sizes="(max-width: 640px) 95vw, (max-width: 768px) 50vw, 40vw"
                />
              </div>
            ) : (
              <div className="text-center">
                <ImagePlus className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-Text-A/50" />
                <p className="mt-2 text-xs sm:text-sm text-Text-A/70 px-2">
                  Belum ada gambar diunggah
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
