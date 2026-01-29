import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.js'],
  timeout: 60000,

  fullyParallel: false,
  retries: process.env.CI ? 2 : 0, // Retries only occur on test failures
  workers: process.env.CI ? 1 : 1,
  outputDir: 'reports/test-results',

  timeout: 30000, // Global timeout for each test (30 seconds)
  expect: {
    timeout: 50000, // Timeout for expect() assertions (5 seconds)
  },
  reporter: [
    ['html', { open: 'never', outputFolder: 'reports/playwright-report' }],
    ['allure-playwright', { resultsDir: 'reports/allure-results' }],
  ],
  use: {
    trace: 'off',
    video: 'off',
    viewport: null,
    ignoreHTTPSErrors: true,
    actionTimeout: 50000, // Timeout for each action like click, fill, etc. (5 seconds)
    navigationTimeout: 100000, // Timeout for page navigations (10 seconds)
    launchOptions: {
      args: ['--start-maximized'],
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

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },

    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },

    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
});
