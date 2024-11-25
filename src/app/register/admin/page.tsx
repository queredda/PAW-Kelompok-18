"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { FcGoogle } from "react-icons/fc"
import Navbar from "@/components/global/Navbar"
import Footer from "@/components/global/Footer"

export default function AdminForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    namaperusahaan: "",
    password: "",
    confirmPassword: ""
  })
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add form submission logic here
    console.log(formData, acceptTerms)
  }

  return (
    <main>
        <div className="flex items-center justify-center py-10">
            <div className="bg-gradient-to-br from-[#EA68AA] to-[#8F65BB] p-8 rounded-xl shadow-lg flex items-center max-w-4xl w-full">
        
            <div className="space-y-6">
            <h2 className="text-[36px] font-bold text-white mb-6">
                Masuk ke akunmu
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                type="text"
                placeholder="Nama"
                value={formData.name}
                onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                }
                className="w-full max-w-[433px] py-2 rounded-[30px] bg-[#D9D9D9] text-gray-700 focus:outline-none"
                required
                />
                <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                }
                className="w-full max-w-[433px] py-2 rounded-[30px] bg-[#D9D9D9] text-gray-700 focus:outline-none"
                required
                />
                <Input
                type="text"
                placeholder="Nama Perusahaan"
                value={formData.namaperusahaan}
                onChange={(e) =>
                    setFormData({ ...formData, namaperusahaan: e.target.value })
                }
                className="w-full max-w-[433px] py-2 rounded-[30px] bg-[#D9D9D9] text-gray-700 focus:outline-none"
                required
                />
                <Input
                type="password"
                placeholder="Kata sandi"
                value={formData.password}
                onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                }
                className="w-full max-w-[433px] py-2 rounded-[30px] bg-[#D9D9D9] text-gray-700 focus:outline-none"
                required
                />
                <Input
                type="password"
                placeholder="Konfirmasi kata sandi"
                value={formData.confirmPassword}
                onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full max-w-[433px] py-2 rounded-[30px] bg-[#D9D9D9] text-gray-700 focus:outline-none"
                required
                />
                <div className="w-full  max-w-[396px] flex items-center space-x-2">
                <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                />
                <label
                    htmlFor="terms"
                    className="text-[15px] leading-none text-white"
                >
                    Dengan mendaftar, Anda menyetujui syarat dan ketentuan yang dibuat oleh platform
                </label>
                </div>
                <div className="flex items-center mt-4 gap-[15px]">
                <Button
                    type="submit"
                    className="w-1/3 py-2 bg-[#413D79] text-white rounded-[30px] font-semibold hover:bg-[#4C51BF] transition"
                    disabled={!acceptTerms}
                >
                    Daftar
                </Button>
                <Button
                    type="button"
                    className="flex-1 py-2 bg-[#D9D9D9] rounded-[30px] text-gray-700 font-semibold shadow hover:bg-gray-100 transition flex items-center justify-center">
                    <FcGoogle className="inline h-5 w-5 mr-2" />
                    Sign In with Google
                </Button>
                </div>
            </form>
            </div>
            <div className="flex items-center justify-center flex-1">
            <Image
                src="/logo/LogoWhite.png"
                alt="Box Logo"
                width={300}
                height={300}
                className="h-auto w-full max-w-[300px]"
                priority
            />
            </div>
            </div>
        </div>
        
        <div className="h-[100px]"></div>
    </main>
    
  )
}

