'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { ProfileField } from './ProfileField';
import { useRef } from 'react';
import { updateProfile } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface ProfileData {
  imageUrl: string;
  name: string;
  email: string;
  accountType: string;
  role?: string;
  onProfileUpdate?: (newData: {
    profilePic?: string;
    name: string;
    email: string;
    role: string;
  }) => void;
}

export function ProfileCard({
  imageUrl,
  name,
  email,
  accountType,
  onProfileUpdate,
}: ProfileData) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          description: 'File size should be less than 5MB',
        });
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const result = await updateProfile(formData);
        if (onProfileUpdate) {
          onProfileUpdate(result.user);
        }
        toast({
          description: 'Profile picture updated successfully',
        });
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          variant: 'destructive',
          description: 'Failed to update profile picture. Please try again.',
        });
      }
    }
  };

  return (
    <Card className="bg-gradient-to-r from-[#EA68AA] via-[#8B5799] to-[#264491] text-Text-A w-full max-w-[900px] border-none mx-auto p-4 sm:p-6 md:p-8">
      <CardContent className="flex flex-col items-center gap-6 sm:gap-8 md:gap-10">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72">
            <Image
              src={imageUrl}
              alt="Profile picture"
              layout="fill"
              objectFit="cover"
              className="rounded-xl shadow-lg"
              priority
            />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <Button
            variant="secondary"
            size="sm"
            className="text-sm sm:text-base px-6 py-2 whitespace-nowrap"
            onClick={() => fileInputRef.current?.click()}
          >
            Edit Photo
          </Button>
        </div>
        <div className="space-y-4 w-full max-w-3xl">
          <ProfileField label="Nama" value={name} />
          <ProfileField label="Email" value={email} />
          <ProfileField label="Role" value={accountType} />
        </div>
      </CardContent>
    </Card>
  );
}
