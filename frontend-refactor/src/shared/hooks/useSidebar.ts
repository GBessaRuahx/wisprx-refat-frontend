import { useState, useEffect } from 'react';

export type DrawerVariant = 'permanent' | 'temporary';

export function useSidebar() {
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<DrawerVariant>('permanent');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth > 1200) setOpen(true);
      setVariant(window.innerWidth < 600 ? 'temporary' : 'permanent');
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setVariant(window.innerWidth < 600 ? 'temporary' : 'permanent');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggle = () => setOpen(o => !o);
  const close = () => setOpen(false);
  const openDrawer = () => setOpen(true);

  return { open, variant, toggle, close, openDrawer };
}

export default useSidebar;
