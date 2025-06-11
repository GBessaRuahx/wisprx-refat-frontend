import { ReactNode } from 'react';
import AppBar from './AppBar';
import Sidebar from './Sidebar';

interface Props {
  children: ReactNode;
}

export default function LoggedInLayout({ children }: Props) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AppBar />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
