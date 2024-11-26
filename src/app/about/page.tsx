import React from 'react';
import Logo from '/public/logo/Logo.svg';
import Image from 'next/image';
import { Card } from "@/components/ui/card";

const About = () => {
  const teamMembers = [
    {
      name: 'Mahsa Quereda Bahjah',
      id: '22/503299/TK/54984', 
      img: '/team-member/mahsa.png',
    },
    {
      name: 'Muhamad Farrel Adrian',
      id: '22/505897/TK/55394',
      img: '/team-member/repal.png',
    },
    {
      name: 'Nashatra Aqila R.',
      id: '22/504580/TK/55195',
      img: '/team-member/nasha.png',
    },
    {
      name: 'Septian Eka Rahmadi',
      id: '22/496732/TK/54442',
      img: '/team-member/eka.png',
    },
    {
      name: 'Raden Arya Bismo N.',
      id: '22/494473/TK/54233',
      img: '/team-member/aryo.png',
    },
  ];

  return (
    <main className="min-h-screen w-full">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
        <div className="flex flex-col lg:flex-row items-center justify-center py-8 sm:py-12 lg:py-20 gap-6 lg:gap-12">
          {/* Logo */}
          <div className="flex-shrink-0 w-full sm:w-auto lg:mr-12">
            <Image
              src={Logo}
              alt="Logo"
              className="w-full h-auto max-w-[120px] sm:max-w-[140px] lg:max-w-[165px] mx-auto lg:mx-0"
              priority
            />
          </div>

          {/* Header */}
          <div className="text-center lg:text-left max-w-[90%] sm:max-w-[80%] lg:max-w-[525px]">
            <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-semibold leading-tight mb-4 text-white">
              About this project
            </h1>
            <p className="text-sm sm:text-base lg:text-[17px] text-white leading-relaxed text-justify">
              Box adalah platform inventaris barang untuk membantu perusahaan
              kecil dalam mengelola aset yang dimiliki. Project ini diharapkan
              dapat digunakan sebagai sarana yang mampu digunakan sehari-hari.
              Project ini merupakan implementasi dari tugas akhir matakuliah
              Pengembangan Aplikasi Web / Web Development pada program studi
              Teknologi Informasi, Departemen Teknik Elektro dan Teknologi
              Informasi, Fakultas Teknik, Universitas Gadjah Mada.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-white">
            About our team
          </h2>
        </div>

        {/* Team Members Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* First Row - 3 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
            {teamMembers.slice(0, 3).map((member, index) => (
              <div key={index} className="flex justify-center">
                <Card className="w-full max-w-[350px] bg-gradient-to-br from-[#EA68AA] to-[#8F65BB] p-4 sm:p-6 transform transition-transform hover:scale-105 border-none">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px]">
                      <Image
                        className="rounded-full object-cover"
                        alt={member.name}
                        src={member.img}
                        fill
                        sizes="(max-width: 640px) 120px, 140px"
                      />
                    </div>
                    
                    <div className="text-center space-y-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-white">
                        {member.name}
                      </h3>
                      <p className="text-sm sm:text-base text-white/90 font-pop">
                        {member.id}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {/* Second Row - 2 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-[768px] mx-auto">
            {teamMembers.slice(3).map((member, index) => (
              <div key={index + 3} className="flex justify-center">
                <Card className="w-full max-w-[350px] bg-gradient-to-br from-[#EA68AA] to-[#8F65BB] p-4 sm:p-6 transform transition-transform hover:scale-105 border-none">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px]">
                      <Image
                        className="rounded-full object-cover"
                        alt={member.name}
                        src={member.img}
                        fill
                        sizes="(max-width: 640px) 120px, 140px"
                      />
                    </div>
                    
                    <div className="text-center space-y-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-white">
                        {member.name}
                      </h3>
                      <p className="text-sm sm:text-base text-white/90 font-pop">
                        {member.id}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="h-12 sm:h-16 lg:h-24"></div>
    </main>
  );
};

export default About;
