import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['**/*.test.offline.ts'],
    globalSetup: './tests/offline/globalSetup.ts',
    testTimeout: 10000,
  },
});
