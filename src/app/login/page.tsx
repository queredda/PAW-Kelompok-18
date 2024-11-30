'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  email: z.string().email('Email harus diisi dengan benar'),
  password: z.string().min(1, 'Password harus diisi'),
});

const LoginPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // First, check if the email exists
      const checkEmailResponse = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });

      if (!checkEmailResponse.ok) {
        throw new Error('Failed to check email');
      }

      const emailCheckData = await checkEmailResponse.json();

      if (!emailCheckData.exists) {
        toast({
          variant: 'destructive',
          description: 'No account found with this email',
        });
        return;
      }

      // If email exists, proceed with login
      const signInData = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: callbackUrl,
      });

      if (signInData?.error) {
        toast({
          variant: 'destructive',
          description: 'Invalid password',
        });
      } else {
        toast({
          description: 'Successfully logged in',
        });
        router.push(signInData?.url || callbackUrl);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        description: 'An error occurred during login',
      });
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

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Email"
                            className="bg-Input-A text-gray-700 rounded-full border-0 placeholder:text-gray-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Password"
                            className="bg-Input-A text-gray-700 rounded-full border-0 placeholder:text-gray-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-[#413D79] text-white hover:bg-[#4C51BF] rounded-full border-0"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? 'Loading...' : 'Login'}
                  </Button>
                </form>
              </Form>

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
