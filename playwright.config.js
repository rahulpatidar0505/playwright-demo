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
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    viewport: null,
    ignoreHTTPSErrors: true,
    launchOptions: {
      args: ['--start-maximized']
    },
  },

  projects: [
    // {
    //   name: 'chromium',
    //   use: { 
    //     ...devices['Desktop Chrome'],
    //     viewport: null,
    //     deviceScaleFactor: undefined,
    //   },
    // },
    
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

    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

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
