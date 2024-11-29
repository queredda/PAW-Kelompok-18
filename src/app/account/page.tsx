'use client';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchProfile } from '@/lib/api';
import defaultPic from '/public/profile/default.svg';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileData {
  profilePic?: string;
  name: string;
  email: string;
  role: string;
}

export default function AccountPage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const getProfileData = async () => {
      if (session?.user) {
        try {
          const data = await fetchProfile();
          setProfileData(data);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      }
    };

    getProfileData();
  }, [session]);

  const handleProfileUpdate = async (newData: {
    profilePic?: string;
    name: string;
    email: string;
    role: string;
  }) => {
    setIsUpdating(true);
    setProfileData(newData);
    try {
      const updatedData = await fetchProfile();
      setProfileData(updatedData);
      router.refresh();
    } catch (error) {
      console.error('Failed to fetch updated profile:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (status === 'loading' || isUpdating) {
    return (
      <div className="w-full min-h-screen bg-Background-A px-8 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-10">
        <Skeleton className="h-12 w-64 mx-auto mb-8 sm:mb-10" />
        <div className="w-full max-w-[900px] mx-auto p-4 sm:p-6 md:p-8">
          <div className="flex flex-col items-center gap-6 sm:gap-8 md:gap-10">
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-xl" />
              <Skeleton className="h-9 w-24" />
            </div>
            <div className="space-y-4 w-full max-w-3xl">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user?.name || !session?.user?.email) {
    return <div>Missing user information</div>;
  }

  return (
    <div className="w-full min-h-screen bg-Background-A px-8 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-10">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-Text-A mb-8 sm:mb-10">
        Account detail
      </h1>
      <ProfileCard
        imageUrl={profileData?.profilePic || defaultPic}
        name={profileData?.name || session.user.name}
        email={profileData?.email || session.user.email}
        accountType={profileData?.role || session.user.role}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
}
