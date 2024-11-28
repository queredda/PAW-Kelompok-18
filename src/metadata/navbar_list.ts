import { NavbarProps } from "@/types/inventory";

export type { NavbarProps };

export const protectedNavItems = (role: string): NavbarProps[] => {
  if (role === 'admin') {
    return [
      { menu: 'Dashboard', path: '/admin' },
      { menu: 'Inventory', path: '/admin/inventory' },
      { menu: 'Borrowed', path: '/admin/borrowed' },
      { menu: 'Account', path: '/account' },
    ];
  } else if (role === 'user') {
    return [
      { menu: 'Dashboard', path: '/employee' },
      { menu: 'Inventory', path: '/employee/inventory' },
      { menu: 'Borrowed', path: '/employee/borrowed' },
      { menu: 'Account', path: '/account' },
    ];
  }
  return [];
};

export const publicNavItems: NavbarProps[] = [
  { menu: 'Home', path: '/' },
  { menu: 'About', path: '/about' },
];
