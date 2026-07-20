import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ['config.test.ts', 'infra/**/*.test.ts', 'src/**/*.test.ts'],
    exclude: ['src/**/*.test.e2e.ts'],
  },
});
