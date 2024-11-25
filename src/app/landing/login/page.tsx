"use client";

import React, { useState } from "react";
import Navbar from "@/components/global/Navbar";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import Footer from "@/components/global/Footer";

const LoginPage = (): JSX.Element => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <main>

      {/* Login Section */}
      <div className="flex items-center justify-center py-20">
        <div className="bg-gradient-to-br from-[#EA68AA] to-[#8F65BB] p-8 rounded-xl shadow-lg flex items-center max-w-4xl w-full">
          {/* Left Section */}
          <div className="flex-1">
            <h2 className="text-[36px] font-bold text-white mb-6">Masuk ke akunmu</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-[30px] bg-[#D9D9D9] text-gray-700 focus:outline-none"
                required
              />
              {/* Password Input */}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-[30px] bg-[#D9D9D9] text-gray-700 focus:outline-none"
                required
              />
              <div className="flex items-center gap-[15px] mt-4">
                {/* Login Button */}
                <button
                  type="submit"
                  className="w-1/3 py-2 bg-[#413D79] text-white rounded-[30px] font-semibold hover:bg-[#4C51BF] transition">
                  Login
                </button>

                {/* Google Login */}
                <button
                  type="button"
                  className="flex-1 py-2 bg-[#D9D9D9] text-gray-700 rounded-[30px] font-semibold shadow hover:bg-gray-100 transition flex items-center justify-center">
                  <FcGoogle className="inline h-5 w-5 mr-2" />
                  Log In with Google
                </button>
              </div>
            </form>

            {/* Signup Link */}
            <p className="mt-4 text-sm text-white">
              Belum punya akun?{" "}
              <button
                onClick={() => router.push("/landing/register/type-selection")}
                className="text-pink-300 underline hover:text-[#413d79]">
                Daftar dulu yuk
              </button>
            </p>
          </div>

          {/* Right Section */}
          <div className="flex items-center justify-center flex-1">
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
      </div>

      <div className="h-[100px]"></div>
    </main>
  );
};

export default LoginPage;
