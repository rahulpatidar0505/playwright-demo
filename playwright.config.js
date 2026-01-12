import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: process.env.CI ? 2 : 1, // Retries only occur on test failures 
  workers: process.env.CI ? 1 : 1,
  outputDir: 'reports/test-results',
  reporter: [
    ['html', { open: 'never', outputFolder: 'reports/playwright-report' }],
    ['allure-playwright', { resultsDir: 'reports/allure-results' }]
  ],
  use: {
    trace: 'on-first-retry',
    video: 'on-first-retry',
    viewport: null,
    ignoreHTTPSErrors: true,
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

