import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineWorkspace } from 'vitest/config';
import storybookTest from '@storybook/addon-vitest/vitest-plugin';
import type { PluginOption } from 'vite';
const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineWorkspace([
  'vitest.config.ts',
  {
    plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest() as unknown as PluginOption,
    ],
    test: {
      name: 'storybook',
      browser: {
        enabled: true,
        headless: true,
        provider: 'playwright',
        instances: [
          {
            browser: 'chromium',
          },
        ],
      },
      setupFiles: ['.storybook/vitest.setup.ts'],
    },
  },
  {
    plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest() as unknown as PluginOption,
    ],
    test: {
      name: 'storybook',
      browser: {
        enabled: true,
        headless: true,
        provider: 'playwright',
        instances: [
          {
            browser: 'chromium',
          },
        ],
      },
      setupFiles: ['.storybook/vitest.setup.ts'],
    },
  },
]);
