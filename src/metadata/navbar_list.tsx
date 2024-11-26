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
export const protectedNavItems = (role: string): NavbarProps[] => {
  const basePath = `/${role}`;
  return [
    {
      menu: 'Dashboard',
      path: `${basePath}/`,
    },
    {
      menu: 'Inventory',
      path: `${basePath}/inventory`,
    },
    {
      menu: 'Borrowed',
      path: `${basePath}/borrowed`,
    },
    {
      menu: 'Account',
      path: `/account`,
    },
  ];
};

export type { NavbarProps };
