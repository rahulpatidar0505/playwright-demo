import { test, expect } from '@playwright/test';

test('Handle Frames', async ({ page }) => {
  await page.goto('https://zenetratechnologies.com/practice-app');
  await page.getByRole('button', { name: 'Accept All' }).click();
  await page.getByText('Frames').click();
  await page.getByTestId('load-practice-frame').click();

  // Create frame locator for cleaner code
  const frame = page.frameLocator('[data-testid="practice-iframe"]');

  // Fill form fields
  await frame.getByTestId('frame-name-input').fill('pallavi');
  await frame.getByTestId('frame-email-input').fill('deore@jhfs');
  await frame.getByTestId('frame-phone-input').fill('9874965');
  await frame.getByTestId('frame-country-select').selectOption('au');
  await frame.locator('div').filter({ hasText: 'Intermediate' }).nth(3).click();
  await frame.getByTestId('frame-message-textarea').fill("jhljkjerytly.t';ur/");
  await frame.getByTestId('frame-terms-checkbox').check();
  await frame.getByTestId('frame-submit-btn').click();

  // Verify success message
  await expect(frame.getByTestId('success-message')).toHaveText(
    '🎉 Form Submitted Successfully!\nThank you for practicing with Playwright automation. All form data has been captured.'
  );
});
