'use client';
import { ProfileCard } from '@/components/profile/ProfileCard';
import pp from '/public/profile/Anjas.svg';

export default function AccountPage() {
  return (
    <div className="w-full min-h-screen bg-Background-A px-8 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-10">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-Text-A mb-8 sm:mb-10">
        Account detail
      </h1>
      <ProfileCard
        imageUrl={pp}
        name="Anjas Maraditha"
        email="anjasmaraditha@gmail.com"
        companyName="PT. Malayang Ke Timur, Tbk"
        accountType="Admin Perusahaan"
        companyCode="53p+14n_3k4"
        onEditPhoto={() => {
          // Handle edit photo logic here
          console.log('Edit photo clicked');
        }}
      />
    </div>
  );
}
