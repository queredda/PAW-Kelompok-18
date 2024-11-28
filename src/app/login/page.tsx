'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';

// Add the JWT parsing function
const parseJwt = (token: string) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join('')
  );
  return JSON.parse(jsonPayload);
};

const LoginPage = (): JSX.Element => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = parseJwt(token);
          console.log('Decoded token (checkLoginStatus):', decoded);
          setIsLoggedIn(true);

          if (decoded.role === 'user') {
            router.push('/employee/');
          } else if (decoded.role === 'admin') {
            router.push('/admin/');
          }
        } catch (error) {
          console.error('Error checking profile:', error);
          localStorage.removeItem('token');
        }
      }
    };

    checkLoginStatus();
  }, [router]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
        withCredentials: true,
      });
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.token) {
        const token = response.data.token;
        const decoded = parseJwt(token);
        console.log('Decoded token (handleSubmit):', decoded);

        localStorage.setItem('token', token);
        document.cookie = `token=${token}; path=/; max-age=86400; secure; samesite=strict`;

        if (decoded.role === 'user') {
          router.push('/employee');
        } else if (decoded.role === 'admin') {
          router.push('/admin');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
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
                  {isLoggedIn ? 'Keluar dari akunmu' : 'Masuk ke akunmu'}
                </CardTitle>
              </CardHeader>

              {isLoggedIn ? (
                <Button
                  onClick={handleLogout}
                  className="w-full bg-[#413D79] text-white hover:bg-[#4C51BF] rounded-full border-0"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Logout'}
                </Button>
              ) : (
                <>
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
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        type="submit"
                        className="w-full bg-[#413D79] text-white hover:bg-[#4C51BF] rounded-full border-0"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Loading...' : 'Login'}
                      </Button>
                    </div>
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
                </>
              )}
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
