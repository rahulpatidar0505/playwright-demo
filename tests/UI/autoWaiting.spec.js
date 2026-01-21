import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://zenetratechnologies.com/practice-app');
  await page.getByRole('button', { name: 'Accept All' }).click();
  await page.getByText('⏱️').click();

  await page.getByTestId('slow-loading-button').click();
  await expect(page.getByText('✅ Process completed!')).toBeVisible();

  await page.getByTestId('animation-button').click();
  await expect(
    page.getByText(
      '✅ Animation completed! Element is now stable and ready for interaction.',
      { exact: true }
    )
  ).toBeVisible();
});

test.describe('Auto Waiting Examples', () => {
  test('basic auto waiting test', async ({ page }) => {
    // Set longer timeout for slow applications
    test.setTimeout(120000); // 2 minutes

    await page.goto('https://zenetratechnologies.com/practice-app', {
      waitUntil: 'networkidle',
    });
    await page.getByRole('button', { name: 'Accept All' }).click();
    await page.getByText('⏱️').click();

    // Example 1: Basic waiting with custom timeout
    await page.getByTestId('slow-loading-button').click();
    await expect(page.getByText('✅ Process completed!')).toBeVisible({
      timeout: 60000, // 1 minute timeout for slow operations
    });

    // Example 2: Wait for element using waitForSelector
    await page.getByTestId('animation-button').click();
    await expect(
      page.getByText(
        '✅ Animation completed! Element is now stable and ready for interaction.',
        { exact: true }
      )
    ).toBeVisible({ timeout: 30000 });
  });
});
