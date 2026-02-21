import { defineConfig, devices } from '@playwright/experimental-ct-vue';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  testDir: './src',
  testMatch: '**/*.ct.spec.ts',
  snapshotDir: './__snapshots__',
  timeout: 10_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    ctPort: 3100,
    trace: 'on-first-retry',
    ctViteConfig: {
      resolve: {
        alias: {
          src: resolve(__dirname, 'src'),
        },
      },
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

