import React from 'react';
import MainLayout from './layout/MainLayout';
import { QueryClientProvider, AuthProvider } from './providers';

interface AppProps {
  Component: React.ComponentType<any>;
  pageProps: any;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider>
      <AuthProvider>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </AuthProvider>
    </QueryClientProvider>
  );
}
