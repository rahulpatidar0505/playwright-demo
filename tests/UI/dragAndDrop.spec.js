import { test, expect } from '@playwright/test';

test('Drag and Drop test', async ({ page }) => {
  await page.goto('https://zenetratechnologies.com/practice-app');
  await page.getByRole('button', { name: 'Accept All' }).click();
  await page.getByText('🎨UI Elements').click();
  await expect(
    page.getByText('Drop items here', { exact: true })
  ).toBeVisible();
  await page.getByTestId('draggable-1').dragTo(page.getByTestId('dropZone'));
  await page.getByTestId('draggable-2').dragTo(page.getByTestId('dropZone'));
  await expect(
    page.getByText('Drop items here', { exact: true })
  ).not.toBeVisible();
  await page.getByTestId('resetDragDrop').click();
  await expect(
    page.getByText('Drop items here', { exact: true })
  ).toBeVisible();
});
