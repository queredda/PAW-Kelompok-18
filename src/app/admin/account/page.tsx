import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import pp from '/public/profile/Anjas.svg';

export default function AccountPage() {
  return (
    <div className="space-y-8 w-full min-h-screen bg-Background-A px-4 px-[40px] md:px-8 py-4 sm:py-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-Text-A mb-6">
        Account detail
      </h1>
      <Card className="bg-gradient-to-r from-[#EA68AA] via-[#8B5799] to-[#264491] text-Text-A w-full max-w-[800px] mx-auto p-2 sm:p-4">
        <CardContent className="flex flex-col items-center gap-4 sm:gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-32 h-32 sm:w-48 sm:h-48">
              <Image
                src={pp}
                alt="Profile picture"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                priority
              />
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="text-[10px] sm:text-xs whitespace-nowrap"
            >
              Edit Photo
            </Button>
          </div>
          <div className="space-y-2 sm:space-y-3 w-full text-xs sm:text-base">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <strong className="min-w-[100px] sm:min-w-[180px]">Nama:</strong>
              <span className="break-words">Anjas Maraditha</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <strong className="min-w-[100px] sm:min-w-[180px]">Email:</strong>
              <span className="break-words">anjasmaraditha@gmail.com</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <strong className="min-w-[100px] sm:min-w-[180px]">
                Nama Perusahaan:
              </strong>
              <span className="break-words">PT. Malayang Ke Timur, Tbk</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <strong className="min-w-[100px] sm:min-w-[180px]">
                Tipe Akun:
              </strong>
              <span className="break-words">Admin Perusahaan</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <strong className="min-w-[100px] sm:min-w-[180px]">
                Kode Unik Perusahaan:
              </strong>
              <span className="break-words">53p+14n_3k4</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
