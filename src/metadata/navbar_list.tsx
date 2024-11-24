import { NavbarProps } from '@/types/inventory';

export const navbar_list: NavbarProps[] = [
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
