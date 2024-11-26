'use client';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { fetchProfile } from '@/lib/api';

export default function AccountPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  useEffect(() => {
    const getProfileData = async () => {
      console.log('Session state:', session);
      
      if (session?.accessToken) {
        console.log('Access token found:', session.accessToken);
        try {
          const data = await fetchProfile(session.accessToken);
          console.log('Profile data in component:', data);
        } catch (error) {
          console.error('Failed to fetch profile in component:', error);
        }
      } else {
        console.log('No access token available');
      }
    };

    getProfileData();
  }, [session]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen bg-Background-A px-8 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-10">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-Text-A mb-8 sm:mb-10">
        Account detail
      </h1>
      <ProfileCard
        imageUrl={session.user.image || '/default-avatar.png'}
        name={session.user.name}
        email={session.user.email}
        accountType={session.user.role || 'User'}
      />
    </div>
  );
}
