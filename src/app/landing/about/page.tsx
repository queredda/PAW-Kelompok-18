import React from "react";
import Link from "next/link"
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";

const About = () => {
  // team member's data
  const teamMembers = [
    {
      name: "Mahsa Quereda Bahjah",
      id: "22/503299/TK/54984",
      img: "/team-member/mahsa.png",
    },
    {
      name: "Muhamad Farrel Adrian",
      id: "22/505897/TK/55394",
      img: "/team-member/repal.png",
    },
    {
      name: "Nashatra Aqila R.",
      id: "22/504580/TK/55195",
      img: "/team-member/nasha.png",
    },
    {
      name: "Septian Eka Rahmadi",
      id: "22/496732/TK/54442",
      img: "/team-member/eka.png",
    },
    {
      name: "Raden Arya Bismo N.",
      id: "22/494473/TK/54233",
      img: "/team-member/aryo.png",
    },
  ];

  return (
    <main>
      <Navbar />

      <section className="container mx-auto px-20">
      <div className="flex items-center justify-center py-20">
        {/* Logo */}
        <div className="flex-shrink-0 mr-10 pt-30">
          <img
            src="/assets/Logo.png"
            alt="Logo"
            className="w-full h-auto max-w-[165px]"
          />
        </div>

        {/* Header */}
        <div className="text-left">
          <h1 className="text-[36px] font-semibold leading-[41px] mb-4 text-white">
            About this project
          </h1>
          <div className="w-full max-w-[525px]">
            <p className="text-[17px] text-white leading-relaxed">
              Box adalah platform inventaris barang untuk membantu perusahaan kecil
              dalam mengelola aset yang dimiliki. Project ini diharapkan dapat
              digunakan sebagai sarana yang mampu digunakan sehari-hari. Project
              ini merupakan implementasi dari tugas akhir matakuliah Pengembangan
              Aplikasi Web / Web Development pada program studi Teknologi
              Informasi, Departemen Teknik Elektro dan Teknologi Informasi,
              Fakultas Teknik, Universitas Gadjah Mada.
            </p>
          </div>
        </div>        
      </div>
      </section>
      

      {/* Team Section */}
      <section className="container mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h2 className="text-[36px] font-bold text-white">About our team</h2>
      </div>

      {/* Team Members */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-[15px] gap-y-[20px] p-4">
        {teamMembers.map((member, index) => {
          // Manual position for member 4 and 5
          const customStyles =
            index === 3
            ? "col-span-2 col-start-1 row-start-2"
            : index === 4
            ? "col-span-2 col-start-2 row-start-2"
            : "";

          return (
            <div
              key={index}
              className={`mx-auto ${customStyles}`}
            >
              <div className="relative w-[255px] h-[252px] gap-[20px]">
                {/* Background Gradient */}
                <div className="absolute w-[255px] h-[170px] top-[67px] left-0 rounded-[20px] [background:linear-gradient(180deg,rgb(234,104,170)_0%,rgb(143,101,187)_100%)]" />

                {/* Nama Anggota */}
                <div className="absolute w-[255px] top-[157px] font-semibold text-white text-[19px] text-center tracking-[0] leading-[21.8px] ">
                  {member.name}
                </div>

                {/* ID Anggota */}
                <div className="absolute w-[255px] top-[180px] left-0 [font-family:'Poppins-Regular',Helvetica] text-white text-[15px] text-center tracking-[0] leading-[normal]">
                  {member.id}
                </div>

                {/* Foto Anggota */}
                <img
                  className="absolute w-[120px] h-[120px] top-0 center left-[65px] object-cover rounded-full"
                  alt={member.name}
                  src={member.img}
                />
              </div>
            </div>
          );
        })}
      </div>


      </section>
      <div className="h-[100px]"></div>

    </main>
    
  );
};

export default About;
