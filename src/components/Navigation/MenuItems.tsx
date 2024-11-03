import { Home, HelpCircle, History, Mail, Shield } from 'lucide-react';
import { MenuItem } from './MenuItem';
import type { Page } from '../../types';

interface MenuItemsProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onClose: () => void;
}

export function MenuItems({ currentPage, onPageChange, onClose }: MenuItemsProps) {
  const menuItems = [
    { icon: Home, label: 'Home', page: 'game' as const },
    { icon: HelpCircle, label: 'How to Play', page: 'how-to-play' as const },
    { icon: History, label: 'Recent Games', page: 'history' as const },
    { icon: Mail, label: 'Contact Us', page: 'contact' as const },
    { icon: Shield, label: 'Privacy Policy', page: 'privacy' as const },
  ];

  const handlePageChange = (page: Page) => {
    onPageChange(page);
    onClose();
  };

  return (
    <nav className="py-1 relative z-[100]">
      {menuItems.map((item) => (
        <MenuItem
          key={item.page}
          {...item}
          currentPage={currentPage}
          onClick={handlePageChange}
        />
      ))}
    </nav>
  );
}