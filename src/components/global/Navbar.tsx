'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import useScreenType from 'react-screentype-hook';
import { motion, AnimatePresence } from 'framer-motion';
import { RiMenu4Fill } from 'react-icons/ri';
import { HiX } from 'react-icons/hi';
import { IoSettingsOutline } from 'react-icons/io5';
import { publicNavItems, protectedNavItems, NavbarProps } from '@/metadata/navbar_list';
import { Button } from '../ui/button';
import Image from 'next/image';
import { useSession, signOut, getSession } from "next-auth/react";
import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from '/public/logo/LogoWhite.svg';

const Navbar: React.FC = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const navItems = isAuthenticated ? protectedNavItems : publicNavItems;

  const screenType = useScreenType();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  const menuVariants = {
    closed: {
      x: '100%',
      opacity: 0,
      transition: {
        duration: 0.3,
        type: 'tween',
        ease: 'easeInOut',
      },
    },
    open: {
      x: '25%',
      opacity: 1,
      transition: {
        duration: 0.3,
        type: 'tween',
        ease: 'easeInOut',
      },
    },
  };

  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
    open: {
      opacity: 0.75,
      transition: {
        duration: 0.3,
      },
    },
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleScroll = (): void => {
    const scroll = window.scrollY;
    if (scroll > 20) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (path: string): void => {
    router.push(path);
  };

  const handleLogout = async () => {
    try {
      const session = await getSession();
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      await signOut({ redirect: true, callbackUrl: '/' });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      console.log('Navbar - JWT Token:', session.accessToken);
    }
  }, [session]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={twMerge(
          'w-screen backdrop-blur-lg',
          isScrolled
            ? 'h-[60px] bg-Background-A/80 shadow-3xl '
            : 'h-[70px] bg-Background-A',
          'fixed p-4 lg:px-8 z-10 duration-200'
        )}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between h-full relative ">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-shrink-0 "
          >
            <button
              className="flex items-center gap-x-3"
              onClick={() => handleNavigation('/')}
            >
              <Image
                src={Logo}
                alt="Logo"
                width={isScrolled ? 24 : 32}
                height={isScrolled ? 24 : 32}
                className="transition-all duration-200"
              />
              <div className="flex flex-col text-start">
                <span
                  className={`font-bold text-Text-A font-pop transition-all duration-200 ${
                    isScrolled ? 'text-[12px]' : 'text-[16px]'
                  }`}
                >
                  Inventory Management System
                </span>
                <p className="text-sm text-Text-A">Solution for your business</p>
              </div>
            </button>
          </motion.div>

          {!screenType.isMobile && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex-grow flex justify-center items-center gap-x-8"
            >
              {navItems.map((item: NavbarProps, index: number) => (
                <button
                  key={index}
                  className={twMerge(
                    'font-pop mx-4 transition-all duration-200',
                    isScrolled ? 'text-[14px]' : 'text-[16px]',
                    pathname === item.path
                      ? 'text-Text-A font-bold'
                      : 'text-Text-A'
                  )}
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.menu}
                </button>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex-shrink-0 flex items-center gap-x-4"
          >
            {!screenType.isMobile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative p-2">
                    <IoSettingsOutline
                      className={`text-Text-A transition-all duration-200 ${
                        isScrolled ? 'w-[20px] h-[20px]' : 'w-[24px] h-[24px]'
                      }`}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="font-pop">
                  {isAuthenticated ? (
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => handleNavigation('/login')}>
                      Login
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="z-50"
              >
                <motion.div
                  animate={isMobileMenuOpen ? 'open' : 'closed'}
                  variants={{
                    open: { rotate: 180 },
                    closed: { rotate: 0 },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? (
                    <HiX
                      className={`text-Text-A transition-all duration-200 ${
                        isScrolled ? 'w-[20px] h-[20px]' : 'w-[24px] h-[24px]'
                      }`}
                    />
                  ) : (
                    <RiMenu4Fill
                      className={`text-Text-A transition-all duration-200 ${
                        isScrolled ? 'w-[20px] h-[20px]' : 'w-[24px] h-[24px]'
                      }`}
                    />
                  )}
                </motion.div>
              </button>
            )}
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {screenType.isMobile && isMobileMenuOpen && (
          <>
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              className="fixed inset-0 bg-black/40 z-20"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="fixed top-0 right-0 w-3/4 h-screen bg-Background-A overflow-hidden shadow-lg z-30"
            >
              <div className="pt-4 relative">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute right-4 top-4"
                >
                  <HiX className="w-6 h-6 text-Text-A" />
                </button>

                {navItems.map((item: NavbarProps, index: number) => (
                  <motion.button
                    key={index}
                    className="w-full py-3 text-left px-4 text-Text-A font-pop font-medium gap-x-2 text-[16px]"
                    onClick={() => {
                      handleNavigation(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.menu}
                  </motion.button>
                ))}

                {isAuthenticated ? (
                  <motion.button
                    className="w-full py-3 text-left px-4 text-Text-A font-pop font-medium text-[16px]"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </motion.button>
                ) : (
                  <motion.button
                    className="w-full py-3 text-left px-4 text-Text-A font-pop font-medium text-[16px]"
                    onClick={() => {
                      handleNavigation('/login');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
