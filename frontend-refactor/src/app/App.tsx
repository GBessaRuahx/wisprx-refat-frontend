import React from 'react';
import QueryClientProvider from './providers/QueryClientProvider';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import AppLayout from './layout/AppLayout';

export interface AppProps {

  Component: React.ComponentType<any>;
  pageProps: any;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider>
      <AuthProvider>
        <ThemeProvider>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
