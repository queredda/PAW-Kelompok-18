'use client';

import { useState } from 'react';
import { ImagePlus } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

  return (
    <Card className="bg-pink-400/20 text-Text-A">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Daftarkan item baru</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nama item</Label>
              <Input
                id="name"
                placeholder="Nama item"
                className="bg-white/10 mt-1 text-Text-A"
              />
            </div>
            <div>
              <Label htmlFor="category">Kategori item</Label>
              <Input
                id="category"
                placeholder="Kategori item"
                className="bg-white/10 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="location">Lokasi Penyimpanan</Label>
              <Input
                id="location"
                placeholder="Lokasi Penyimpanan"
                className="bg-white/10 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Kuantitas item</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Kuantitas item"
                className="bg-white/10 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="image">Unggah gambar item</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="bg-white/10 text-Text-A mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Masukkan password akun anda</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                className="bg-white/10 mt-1"
              />
            </div>
            <Button className="w-full bg-purple-700 hover:bg-purple-600">
              Daftar
            </Button>
          </div>
          <div className="flex items-center justify-center bg-white/10 rounded-lg">
            {image ? (
              <div className="relative w-full h-[300px]">
                <Image
                  src={image}
                  alt="Preview"
                  className="object-contain"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="text-center">
                <ImagePlus className="mx-auto h-12 w-12 text-Text-A/50" />
                <p className="mt-2 text-sm text-Text-A/70">
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
