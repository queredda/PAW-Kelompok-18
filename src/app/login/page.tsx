"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

const LoginPage = (): JSX.Element => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        email,
        password
      }, {
        withCredentials: true
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        document.cookie = `token=${response.data.token}; path=/; max-age=86400; secure; samesite=strict`;
      }

      router.push("/");
      router.refresh();
      
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="py-20 container mx-auto flex items-center justify-center">
      <Card className="w-full max-w-4xl bg-gradient-to-br from-[#EA68AA] to-[#8F65BB] text-white border-0 mx-4 sm:mx-0">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Logo Section - Shows first on mobile */}
            <div className="lg:hidden w-full flex justify-center">
              <Image
                src="/logo/LogoWhite.png"
                alt="Box Logo"
                width={220}
                height={300}
                className="w-[160px] sm:w-[180px] h-auto"
                priority
              />
            </div>

            {/* Left Section */}
            <div className="w-full lg:w-1/2 space-y-8">
              <CardHeader className="p-0">
                <CardTitle className="text-[28px] sm:text-[36px] font-bold text-center lg:text-left">
                  Masuk ke akunmu
                </CardTitle>
              </CardHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-Input-A text-gray-700 rounded-full border-0 placeholder:text-gray-500"
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-Input-A text-gray-700 rounded-full border-0 placeholder:text-gray-500"
                  required
                />
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="submit"
                    className="w-full bg-[#413D79] text-white hover:bg-[#4C51BF] rounded-full border-0"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Login"}
                  </Button>
                </div>
              </form>

              <div className="text-sm text-center lg:text-left">
                Belum punya akun?{" "}
                <Button
                  variant="link"
                  onClick={() => router.push("/register")}
                  className="text-pink-300 hover:text-[#413d79] p-0 h-auto font-normal underline"
                >
                  Daftar dulu yuk
                </Button>
              </div>
            </div>

            {/* Right Section - Logo hidden on mobile */}
            <div className="hidden lg:flex w-1/2 items-center justify-center">
              <Image
                src="/logo/LogoWhite.png"
                alt="Box Logo"
                width={220}
                height={300}
                className="w-[220px] h-auto"
                priority
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default LoginPage;
