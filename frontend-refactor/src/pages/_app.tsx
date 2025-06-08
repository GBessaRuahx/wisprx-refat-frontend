import type { AppProps } from 'next/app';
import App from '../app/App';
import QueryClientProvider from '../app/providers/QueryClientProvider';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider>
      <App Component={Component} pageProps={pageProps} />
    </QueryClientProvider>
  );
}
