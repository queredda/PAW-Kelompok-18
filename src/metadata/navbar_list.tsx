import { NavbarProps } from '@/types/inventory';

export type { NavbarProps };

export const protectedNavItems = (role: string): NavbarProps[] => {  
  if (role === 'ADMIN') {
    return [
      { menu: 'Dashboard', path: '/admin' },
      { menu: 'Inventory', path: '/admin/inventory' },
      { menu: 'Borrowed', path: '/admin/borrowed' },
      { menu: 'Account', path: '/account' },
    ];
  } else if (role === 'USER') {
    return [
      { menu: 'Dashboard', path: '/employee' },
      { menu: 'Loan', path: '/employee/loan' },
      { menu: 'Account', path: '/account' },
    ];
  }
  
  console.log('No matching role found, returning empty array');
  return [];
};

export const publicNavItems: NavbarProps[] = [
  { menu: 'Home', path: '/' },
  { menu: 'About', path: '/about' },
];
