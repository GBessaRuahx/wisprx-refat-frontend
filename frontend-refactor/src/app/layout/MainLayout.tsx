import { ReactNode } from 'react';
import Navbar from './Navbar';

interface Props {
  children: ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
