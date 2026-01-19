import { test, expect } from '@playwright/test';

// This is kust for an example of shadow DOM element interaction,
// without any extra setup we can access shadow DOM elements directly using Playwright's built-in support.
test('test', async ({ page }) => {
  await page.goto('http://localhost:4200/practice-app');
  await page.getByRole('button', { name: 'Accept All' }).click();
  await page.getByText('👤').click();
  await page.getByTestId('shadow-button').click();
  await expect(page.getByText('Button clicked successfully!')).toBeVisible();
});
