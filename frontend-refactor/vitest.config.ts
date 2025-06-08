import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.next'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      exclude: ['**/*.d.ts', 'src/shared/assets/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@entities': path.resolve(__dirname, 'src/entities'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@stories': path.resolve(__dirname, 'src/stories'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@ui': path.resolve(__dirname, 'src/ui'),
    },
  },
});
