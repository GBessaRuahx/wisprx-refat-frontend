import Link from 'next/link';
import { useSidebar } from '@shared/hooks/useSidebar';
import { MessageCircle, Home } from 'lucide-react';
import clsx from 'clsx';

interface SidebarItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

const items: SidebarItem[] = [
  { label: 'Dashboard', to: '/', icon: <Home size={18} /> },
  { label: 'Tickets', to: '/tickets', icon: <MessageCircle size={18} /> },
];

export default function Sidebar() {
  const { open, variant } = useSidebar();

  return (
    <aside
      className={clsx(
        'bg-gray-100 border-r h-screen transition-all',
        open ? 'w-56' : 'w-0 overflow-hidden',
        variant === 'temporary' && 'fixed z-40'
      )}
    >
      <nav className="p-2 space-y-1">
        {items.map(item => (
          <Link
            key={item.to}
            href={item.to}
            className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-gray-200"
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
