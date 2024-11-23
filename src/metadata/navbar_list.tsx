import { NavbarProps } from '@/types/inventory';

export const navbar_list: NavbarProps[] = [
  {
    menu: "Dashboard",
    path: "/admin",
  },
  {
    menu: "Inventory",
    path: "/admin/inventory",
  },
  {
    menu: "Borrowed",
    path: "/admin/borrowed",
  },
  {
    menu: "Account",
    path: "/admin/account",
  }
];

export type { NavbarProps };
