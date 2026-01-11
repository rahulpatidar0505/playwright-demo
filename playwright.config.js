import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  outputDir: './playwright-output',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
    reporter: [
    ['html', { open: 'never' }],
    ['allure-playwright']
  ],
  use: {
    trace: 'on-first-retry',
    ignoreHTTPSErrors: true,
    viewport: null,
    launchOptions: {
      args: ['--start-maximized']
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: null,
        deviceScaleFactor: undefined,
      },
    },
  ],

});

