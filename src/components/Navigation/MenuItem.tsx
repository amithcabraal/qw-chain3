import { LucideIcon } from 'lucide-react';
import type { Page } from '../../types';

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  page: Page;
  currentPage: Page;
  onClick: (page: Page) => void;
}

export function MenuItem({ icon: Icon, label, page, currentPage, onClick }: MenuItemProps) {
  return (
    <button
      onClick={() => onClick(page)}
      className={`w-full px-4 py-2 text-left flex items-center gap-3 ${
        currentPage === page
          ? 'bg-emerald-100 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100'
          : 'text-emerald-800 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-800/50'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}