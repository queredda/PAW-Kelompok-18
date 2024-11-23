"use client"

import { useState } from "react"
import { ImagePlus } from 'lucide-react'
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AddItemForm() {
  const [image] = useState<string | null>(null)

  return (
    <Card className="bg-pink-400/20 text-white">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Daftarkan item baru</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nama item</Label>
              <Input id="name" placeholder="Nama item" className="bg-white/10 mt-1" />
            </div>
            <div>
              <Label htmlFor="category">Kategori item</Label>
              <Input id="category" placeholder="Kategori item" className="bg-white/10 mt-1" />
            </div>
            <div>
              <Label htmlFor="location">Lokasi Penyimpanan</Label>
              <Input id="location" placeholder="Lokasi Penyimpanan" className="bg-white/10 mt-1" />
            </div>
            <div>
              <Label htmlFor="quantity">Kuantitas item</Label>
              <Input id="quantity" type="number" placeholder="Kuantitas item" className="bg-white/10 mt-1" />
            </div>
            <div>
              <Label htmlFor="image">Unggah gambar item</Label>
              <Input id="image" type="file" className="bg-white/10 mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Masukkan password akun anda</Label>
              <Input id="password" type="password" placeholder="Password" className="bg-white/10 mt-1" />
            </div>
            <Button className="w-full bg-purple-700 hover:bg-purple-600">
              Daftar
            </Button>
          </div>
          <div className="flex items-center justify-center bg-white/10 rounded-lg">
            {image ? (
              <Image 
                src={image} 
                alt="Preview" 
                className="max-w-full max-h-full object-contain"
                width={300}
                height={300}
              />
            ) : (
              <div className="text-center">
                <ImagePlus className="mx-auto h-12 w-12 text-white/50" />
                <p className="mt-2 text-sm text-white/70">Belum ada gambar diunggah</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
