import { NavbarProps } from '@/types/inventory';

// Public routes (when not logged in)
export const publicNavItems: NavbarProps[] = [
  {
    menu: 'Dashboard',
    path: '/',
  },
  {
    menu: 'About',
    path: '/about',
  },
];

// Protected routes (when logged in)
export const protectedNavItems: NavbarProps[] = [
  {
    menu: 'Dashboard',
    path: '/',
  },
  {
    menu: 'Inventory',
    path: '/inventory',
  },
  {
    menu: 'Borrowed',
    path: '/borrowed',
  },
  {
    menu: 'Account',
    path: '/account',
  },
];

export type { NavbarProps };
