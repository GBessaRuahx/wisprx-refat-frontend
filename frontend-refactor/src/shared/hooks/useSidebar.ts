import { useState, useEffect } from 'react';

export type DrawerVariant = 'permanent' | 'temporary';

const DESKTOP_BREAKPOINT = 1200;
const MOBILE_BREAKPOINT = 600;

export function useSidebar() {
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<DrawerVariant>('permanent');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth > DESKTOP_BREAKPOINT) setOpen(true);
      setVariant(window.innerWidth < MOBILE_BREAKPOINT ? 'temporary' : 'permanent');
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setVariant(window.innerWidth < MOBILE_BREAKPOINT ? 'temporary' : 'permanent');
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
