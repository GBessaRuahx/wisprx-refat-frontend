import {
  QueryClient,
  QueryClientProvider as TanStackQueryClientProvider,
} from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface Props {
  children: ReactNode;
}

export default function QueryClientProvider({ children }: Props) {
  const [client] = useState(() => new QueryClient());
  return (
    <TanStackQueryClientProvider client={client}>
      {children}
    </TanStackQueryClientProvider>
  );
}
