import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import logo from '/public/logo/Logo.svg';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-[#EA68AA] via-[#8B5799] to-[#264491] text-Text-A font-pop px-8 md:px-4 py-12">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Logo and Description Section */}
          <div className="max-w-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-10 h-10">
                <Image
                  src={logo}
                  alt="logo"
                  fill
                  sizes="fill"
                  className="brightness-0 invert"
                  draggable={false}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">
                  Inventory Management System
                </span>
                <p className="text-sm">Solution for your business</p>
              </div>
            </div>
            <p className="text-[12px] md:text-[16px] leading-relaxed text-justify">
              Platform ini adalah project dalam matakuliah Pengembangan Aplikasi
              Web di Departemen Teknik Elektro dan Teknologi Informasi, Fakultas
              Teknik, Universitas Gadjah Mada. Tim Pengembang terdiri dari
              <br />
              Muhamad Farrel Adrian (22/505897/TK/55394),
              <br />
              Mahsa Quereda Bahjah (22/503299/TK/54984),
              <br />
              Nashatra Aqila Ramadhani (22/504580/TK/55195),
              <br />
              Raden Aryo Bismo Nugroho (22/494473/TK/54233),
              <br />
              Septian Eka Rahmadi (22/496732/TK/54442)
            </p>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col items-start justify-start gap-8">
            <div>
              <h3 className="text-[16px] md:text-[20px] text-Text-A font-pop font-semibold mb-4">
                Hubungi kami
              </h3>
              <div className="flex gap-4">
                <Link href="#" className="hover:opacity-80 transition-opacity">
                  <FaInstagram className="w-4 h-4 md:w-8 md:h-8" />
                </Link>
                <Link href="#" className="hover:opacity-80 transition-opacity">
                  <FaLinkedinIn className="w-4 h-4 md:w-8 md:h-8" />
                </Link>
              </div>
            </div>

            {/* Email Subscription */}
            <div className="w-full md:max-w-md">
              <h3 className="text-[16px] md:text-[18px] font-semibold mb-4">
                Tetap terhubung dengan kami, melalui email anda
              </h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-l-lg text-gray-800 focus:outline-none"
                />
                <button className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-r-lg transition-colors">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
