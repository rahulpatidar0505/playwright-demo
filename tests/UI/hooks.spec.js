import { test, expect } from '@playwright/test';

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

test('Test 1', async ({ page }) => {
  console.log('Executing Test 1');
});

test('Test 2', async ({ page }) => {
  console.log('Executing Test 2');
});
