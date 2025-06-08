import type { Decorator, Preview } from '@storybook/nextjs-vite';
import '../src/styles/globals.css';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '../src/shared/i18n/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient();

const withProviders: Decorator = (Story) => {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    </I18nextProvider>
  );
};

const preview: Preview = {
  decorators: [withProviders],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
