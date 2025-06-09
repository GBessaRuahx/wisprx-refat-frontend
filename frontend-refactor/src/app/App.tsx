import React from 'react';
import QueryClientProvider from './providers/QueryClientProvider';
import { AuthProvider } from './providers/AuthProvider';
import AppLayout from './layout/AppLayout';

export interface AppProps {

  Component: React.ComponentType<any>;
  pageProps: any;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider>
      <AuthProvider>

        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>

      </AuthProvider>
    </QueryClientProvider>
  );
}
