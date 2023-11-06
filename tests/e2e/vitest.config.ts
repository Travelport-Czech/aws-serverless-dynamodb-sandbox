import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['**/*.test.e2e.ts'],
    globalSetup: './tests/e2e/globalSetup.ts',
    testTimeout: 10000,
  },
});
