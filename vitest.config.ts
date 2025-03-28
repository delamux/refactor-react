import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['./src/tests/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: './src/tests/setup.ts',
    globals: true,
  },
});
