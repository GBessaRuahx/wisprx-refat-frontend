import '@/styles/globals.css';

import { QueryProvider, SocketProvider } from '@/providers';
import type { Metadata } from 'next';
import { inter } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'WisprX',
  description: 'Plataforma omnichannel integrada e modular',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <QueryProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
