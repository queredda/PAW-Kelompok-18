'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';

const LoginPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // First, check if the email exists using the correct API endpoint
      const checkEmailResponse = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!checkEmailResponse.ok) {
        throw new Error('Failed to check email');
      }

      const emailCheckData = await checkEmailResponse.json();

      if (!emailCheckData.exists) {
        toast({
          variant: "destructive",
          description: "No account found with this email",
        });
        setIsLoading(false);
        return;
      }

      // If email exists, proceed with login
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          variant: "destructive",
          description: "Invalid password",
        });
        return;
      }

      if (result?.ok) {
        toast({
          description: "Successfully logged in",
        });

        // Force a page reload to refresh the session and navigation state
        window.location.href = session?.user?.role === 'admin' ? '/admin' : '/employee';
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        description: "An error occurred during login",
      });
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
                <Button
                  type="submit"
                  className="w-full bg-[#413D79] text-white hover:bg-[#4C51BF] rounded-full border-0"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Login'}
                </Button>
              </form>

              <div className="text-sm text-center lg:text-left">
                Belum punya akun?{' '}
                <Button
                  variant="link"
                  onClick={() => router.push('/register')}
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
