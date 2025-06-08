import type { AppProps } from 'next/app';
import App from '../app/App';
import QueryProvider from '../app/providers/QueryClientProvider';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryProvider>
      <App Component={Component} pageProps={pageProps} />
    </QueryProvider>
  );
}
