'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { register } from '@/lib/api';

const RegisterPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER' as 'USER' | 'ADMIN',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Passwords do not match',
        });
        return;
      }

      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };
      console.log('Register data:', registerData);
      
      await register(registerData);
      toast({
        title: 'Success',
        description: 'Registration successful! Please login.',
      });

      router.push('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Registration failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
                  Buat akun baru
                </CardTitle>
              </CardHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-Input-A text-gray-700 rounded-full border-0 placeholder:text-gray-500"
                  required
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-Input-A text-gray-700 rounded-full border-0 placeholder:text-gray-500"
                  required
                />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-Input-A text-gray-700 rounded-full border-0 placeholder:text-gray-500"
                  required
                />
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-Input-A text-gray-700 rounded-full border-0 placeholder:text-gray-500"
                  required
                />
                <Select
                  value={formData.role}
                  onValueChange={(value: 'USER' | 'ADMIN') =>
                    setFormData((prev) => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger className="bg-Input-A text-gray-700 rounded-full border-0">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="submit"
                  className="w-full bg-[#413D79] text-white hover:bg-[#4C51BF] rounded-full border-0"
                  disabled={isLoading}
                >
                  {isLoading ? 'Registering...' : 'Register'}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-white">
                  Already have an account?{' '}
                  <Button
                    variant="link"
                    className="text-white hover:text-gray-200 p-0"
                    onClick={() => router.push('/login')}
                  >
                    Login here
                  </Button>
                </p>
              </div>
            </div>

            {/* Right Section - Logo (Hidden on mobile) */}
            <div className="hidden lg:block lg:w-1/2">
              <div className="flex justify-center">
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
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default RegisterPage;
