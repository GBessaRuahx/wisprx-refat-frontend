import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Drawer from './Drawer';

interface Props {
  children: ReactNode;
}

export default function AppLayout({ children }: Props) {
  return (
    <div className="flex h-screen">
      <Drawer />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
