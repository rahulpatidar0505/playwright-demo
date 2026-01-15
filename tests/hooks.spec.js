import {test, expect} from '@playwright/test';

test.beforeAll(async () => {
  console.log('Runs once before all tests');
});

test.afterAll(async () => {
  console.log('Runs once after all tests');
});

test.beforeEach(async ({ page }) => {
  console.log('Test starting');
});

test.afterEach(async ({ page }) => {
  console.log('Test finished');
});

test('Test 1: Verify the title', async ({ page }) => {
    console.log('Executing Test 1');
    await page.goto('https://zenetratechnologies.com/practice-app');
    await expect(page).toHaveTitle(/Playwright Practice Application/);
});

test('Test 2: Verify the title', async ({ page }) => {
    console.log('Executing Test 2');
});