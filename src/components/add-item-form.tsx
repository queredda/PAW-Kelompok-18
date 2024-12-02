'use client';

import { useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ItemCondition } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddItemForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    totalKuantitas: '',
    kategori: '',
    kondisi: ItemCondition.BAIK as ItemCondition,
  });
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleConditionChange = (value: ItemCondition) => {
    setFormData({
      ...formData,
      kondisi: value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.name || !formData.totalKuantitas || !formData.kategori || !formData.kondisi) {
        toast({
          title: "Error",
          description: "Semua field harus diisi",
          variant: "destructive",
        });
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('totalKuantitas', formData.totalKuantitas.toString());
      formDataToSend.append('kategori', formData.kategori);
      formDataToSend.append('kondisi', formData.kondisi);
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const response = await fetch('/api/admin/inventory', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create inventory item');
      }

      const result = await response.json();
      console.log('Success:', result);

      setFormData({
        name: '',
        totalKuantitas: '',
        kategori: '',
        kondisi: ItemCondition.BAIK,
      });
      setImage(null);
      setImageFile(null);

      toast({
        title: "Success",
        description: "Item berhasil ditambahkan!",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal menambahkan item. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="bg-gradient-to-br from-Linear-A-from to-Linear-A-to text-Text-A border-none p-4 sm:p-6 lg:p-8">
        <CardContent className="p-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold font-pop mb-4 sm:mb-6 lg:mb-8 text-center lg:text-left">
            Daftarkan item baru
          </h2>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="w-full lg:w-1/2 space-y-4">
              <div>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nama item"
                  className="bg-Input-A text-Text-D rounded-full px-4 w-full"
                  required
                />
              </div>
              <div>
                <Input
                  id="kategori"
                  value={formData.kategori}
                  onChange={handleInputChange}
                  placeholder="Kategori item"
                  className="bg-Input-A text-Text-D rounded-full px-4 w-full"
                  required
                />
              </div>
              <div>
                <Input
                  id="totalKuantitas"
                  type="number"
                  value={formData.totalKuantitas}
                  onChange={handleInputChange}
                  placeholder="Kuantitas item"
                  className="bg-Input-A text-Text-D rounded-full px-4 w-full"
                  required
                />
              </div>
              <Select
                value={formData.kondisi}
                onValueChange={handleConditionChange}
              >
                <SelectTrigger className="bg-Input-A text-Text-D rounded-full px-4 w-full">
                  <SelectValue placeholder="Pilih kondisi item" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ItemCondition.BAIK}>Baik</SelectItem>
                  <SelectItem value={ItemCondition.RUSAK}>Rusak</SelectItem>
                </SelectContent>
              </Select>
              <div>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="bg-Input-A text-Text-D rounded-full px-4 w-full"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-grow sm:flex-grow-0 px-6 py-2 bg-[#413D79] hover:bg-[#413D79]/80 rounded-full text-sm sm:text-base"
                >
                  {isLoading ? 'Memproses...' : 'Daftar'}
                </Button>
                {image && (
                  <Button
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex-grow sm:flex-grow-0 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-full text-sm sm:text-base"
                  >
                    <X className="h-4 w-4 mr-2" /> Hapus Gambar
                  </Button>
                )}
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="aspect-square w-full max-w-md mx-auto bg-white/10 rounded-2xl overflow-hidden">
                {image ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={image}
                      alt="Preview"
                      className="object-contain"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center">
                    <ImagePlus className="h-12 w-12 sm:h-16 sm:w-16 text-Text-A/50" />
                    <p className="mt-4 text-sm sm:text-base text-Text-A/70 px-4 text-center">
                      Belum ada gambar diunggah
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

export default AddItemForm;
