import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['./tests/acceptance/*.test.ts'],
    globalSetup: './tests/acceptance/globalSetup.ts',
    testTimeout: 10000,
  },
});
