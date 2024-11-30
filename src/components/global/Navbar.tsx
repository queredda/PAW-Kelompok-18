'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import useScreenType from 'react-screentype-hook';
import { motion, AnimatePresence } from 'framer-motion';
import { RiMenu4Fill } from 'react-icons/ri';
import { HiX } from 'react-icons/hi';
import { IoSettingsOutline } from 'react-icons/io5';
import {
  publicNavItems,
  protectedNavItems,
  NavbarProps,
} from '@/metadata/navbar_list';
import { Button } from '../ui/button';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from '/public/logo/LogoWhite.svg';

const Navbar: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const screenType = useScreenType();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [currentNavItems, setCurrentNavItems] = useState<NavbarProps[]>(publicNavItems);

  useEffect(() => {
    // console.log('Session status:', status);
    // console.log('Session data:', session);

    if (status === 'authenticated' && session?.user?.role) {
      const items = protectedNavItems(session.user.role);
      // console.log('Setting protected items:', items);
      setCurrentNavItems(items);
    } else {
      // console.log('Setting public items');
      setCurrentNavItems(publicNavItems);
    }
  }, [session, session?.user?.role, status]);

  const handleScroll = (): void => {
    const scroll = window.scrollY;
    setIsScrolled(scroll > 20);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  if (status === 'loading') {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut({
        redirect: false,
        callbackUrl: '/login'
      });
      
      // Force reset the navigation items to public
      setCurrentNavItems(publicNavItems);
      
      // Clear any cached session data
      window.localStorage.removeItem('next-auth.session-token');
      window.localStorage.removeItem('next-auth.callback-url');
      window.localStorage.removeItem('next-auth.csrf-token');
      
      // Force a page reload to clear any remaining state
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during sign out:', error);
      // Fallback: force reload even if there's an error
      window.location.href = '/login';
    }
  };

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

  const handleNavigation = (path: string): void => {
    if (
      (path.startsWith('/admin') || path.startsWith('/employee')) &&
      !session
    ) {
      router.push('/login');
      return;
    }

    if (session?.user?.role === 'admin' && path.startsWith('/employee')) {
      router.push('/admin');
      return;
    }
    if (session?.user?.role === 'user' && path.startsWith('/admin')) {
      router.push('/employee');
      return;
    }

    router.push(path);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={twMerge(
          'w-screen backdrop-blur-lg',
          isScrolled
            ? 'h-[60px] bg-Background-A/80 shadow-3xl'
            : 'h-[70px] bg-Background-A',
          'fixed p-4 lg:px-8 z-10 duration-200'
        )}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between h-full relative">
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
                <p className="text-sm text-Text-A">
                  Solution for your business
                </p>
              </div>
            </button>
          </motion.div>

          {!screenType.isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center"
            >
              {currentNavItems.map((item: NavbarProps, index: number) => (
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
                  {session && session.user ? (
                    <>
                      <DropdownMenuItem className="text-sky-600">
                        {session.user.name}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="text-red-600"
                      >
                        Sign Out
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => router.push('/login')}
                      className="text-green-600"
                    >
                      Sign In
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

                {currentNavItems.map((item: NavbarProps, index: number) => (
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

                {session && session.user ? (
                  <>
                    <motion.div className="w-full py-3 text-left px-4 text-sky-600 font-pop font-medium text-[16px]">
                      {session.user.name}
                    </motion.div>
                    <motion.button
                      className="w-full py-3 text-left px-4 text-red-600 font-pop font-medium text-[16px]"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    className="w-full py-3 text-left px-4 text-green-600 font-pop font-medium text-[16px]"
                    onClick={() => {
                      router.push('/login');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign In
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
