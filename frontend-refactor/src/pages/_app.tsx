import type { AppProps } from 'next/app';
import App from '@app/App';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <App Component={Component} pageProps={pageProps} />;
}
