import { defineConfig } from '@playwright/test';

/**
 * Enhanced Playwright configuration for handling slow applications
 */
export default defineConfig({
  // Global timeout for each test
  timeout: 120000, // 2 minutes per test

  // Timeout for each expect() assertion
  expect: {
    timeout: 30000, // 30 seconds for assertions
  },

  // Global setup timeout
  globalTimeout: 600000, // 10 minutes total

  use: {
    // Action timeout (click, fill, etc.)
    actionTimeout: 15000, // 15 seconds for actions

    // Navigation timeout
    navigationTimeout: 60000, // 1 minute for page loads

    // Wait for page to be fully loaded
    waitUntil: 'domcontentloaded', // Options: 'load', 'domcontentloaded', 'networkidle'
  },

  projects: [
    {
      name: 'fast-environment',
      use: {
        actionTimeout: 5000,
        navigationTimeout: 15000,
      },
      testMatch: '**/*fast*.spec.js',
    },
    {
      name: 'slow-environment',
      use: {
        actionTimeout: 30000,
        navigationTimeout: 120000,
      },
      testMatch: '**/*slow*.spec.js',
    },
    {
      name: 'production-like',
      timeout: 300000, // 5 minutes per test
      use: {
        actionTimeout: 45000,
        navigationTimeout: 180000, // 3 minutes for navigation
      },
      testMatch: '**/*production*.spec.js',
    },
  ],

  // Retry configuration for flaky tests
  retries: process.env.CI ? 3 : 1, // More retries in CI

  // Reporter configuration
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['line'],
  ],

  // Global setup and teardown
  globalSetup: require.resolve('./tests/setup/globalSetup.js'),
  globalTeardown: require.resolve('./tests/setup/globalTeardown.js'),
});
