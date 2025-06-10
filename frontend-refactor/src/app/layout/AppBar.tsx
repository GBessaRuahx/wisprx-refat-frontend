import { useState } from 'react';
import { Menu, Sun, Moon, User, LogOut } from 'lucide-react';
import LanguageControl from '@shared/components/LanguageControl';
import { useAuth, useTheme } from '@app/providers';
import useSidebar from '@shared/hooks/useSidebar';

export default function AppBar() {
  const { toggle } = useSidebar();
  const { mode, toggle: toggleTheme } = useTheme();
  const { user, handleLogout } = useAuth() as any; // typed in provider

  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="flex items-center justify-between h-12 px-4 bg-primary text-white">
      <button onClick={toggle} className="mr-2">
        <Menu size={20} />
      </button>
      <div className="flex-1">
        {user ? `Olá, ${user.name}` : 'WisprX'}
      </div>
      <div className="flex items-center space-x-2">
        <LanguageControl />
        <button onClick={toggleTheme} className="p-1">
          {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="relative">
          <button onClick={() => setProfileOpen(o => !o)} className="p-1">
            <User size={18} />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white text-gray-800 rounded shadow">
              <button
                className="flex items-center px-3 py-2 hover:bg-gray-100 w-full"
                onClick={handleLogout}
              >
                <LogOut className="mr-1" size={14} /> Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
