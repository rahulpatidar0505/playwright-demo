import { test, expect } from '@playwright/test';

test.beforeEach('Navigate to Smart Table', async ({ page }) => {
  await page.goto('https://zenetratechnologies.com/practice-app');
  await page.getByRole('button', { name: 'Accept All' }).click();
  await page.getByText('📋Smart Table').click();
});

test('Test: Add/Edit/Delete Records - Verify all CRUD operations work correctly', async ({
  page,
}) => {
  const table = page.locator('[data-testid="smartTable"]');

  // Step 1: Click "Add New Row" button - verify form appears
  await page.getByTestId('addRowBtn').click();
  const addForm = page.locator('[data-testid="addRowForm"]');
  await expect(addForm).toBeVisible();

  // Step 2: Fill form with test data
  await page
    .getByLabel('First Name *')
    .or(page.getByPlaceholder('First Name *'))
    .fill('Test');
  await page
    .getByLabel('Last Name *')
    .or(page.getByPlaceholder('Last Name *'))
    .fill('User');
  await page.getByTestId('newUsername').fill('testuser');
  await page
    .getByLabel('E-mail *')
    .or(page.getByPlaceholder('E-mail *'))
    .fill('test@test.com');
  await page.getByTestId('newAge').fill('30');
  await page.getByTestId('saveNewRow').click();

  // Step 3: Verify new row appears with the entered data
  const newRow = table.locator('tr', { hasText: 'Test' }).first();
  await expect(newRow).toBeVisible();
  await expect(newRow.locator('td')).toContainText([
    'Test',
    'User',
    'test@test.com',
    '30',
  ]);

  // Step 4: Click "Edit" button on the new row
  await newRow.locator(' button:has-text("✏️")').click();

  // Step 5: Modify data and save - verify changes reflected in table
  await page.locator('//td[3]//input[@type="text"]').fill('Test123');
  await page.locator('//td[4]//input[@type="text"]').fill('User123');
  await page.getByRole('button', { name: '✅' }).click();

  // Verify updated data in table
  const updatedRow = table.locator('tr', { hasText: 'Test123' }).first();
  await expect(updatedRow).toBeVisible();
  await expect(updatedRow.locator('td')).toContainText([
    'Test123',
    'User123',
    '30',
  ]);

  // Step 6: Click "Delete" button on the updated row - verify row is removed
  await updatedRow.locator(' button:has-text("🗑️")').click();

  // Verify row is removed
  await expect(table.locator('tr', { hasText: 'Test123' })).toHaveCount(0);
});
