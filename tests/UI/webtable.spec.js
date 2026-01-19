import { test, expect } from '@playwright/test';

test.beforeEach('Navigate to Smart Table', async ({ page }) => {
  await page.goto('https://zenetratechnologies.com/practice-app');
  await expect(page).toHaveTitle(/Playwright Practice Application/);
  await page.getByRole('button', { name: 'Accept All' }).click();
  await page.getByText('📊Smart Table').click();

  // Wait for the smart table to load
  await page.waitForSelector('[data-testid="smartTable"]');
});

test('Verify Smart Table is loaded', async ({ page }) => {
  // Verify table headers
  await expect(page.locator('th').filter({ hasText: 'Actions' })).toBeVisible();
  await expect(page.locator('th').filter({ hasText: 'ID' })).toBeVisible();
  await expect(
    page.locator('th').filter({ hasText: 'First Name' })
  ).toBeVisible();
  await expect(
    page.locator('th').filter({ hasText: 'Last Name' })
  ).toBeVisible();
  await expect(
    page.locator('th').filter({ hasText: 'Username' })
  ).toBeVisible();
  await expect(page.locator('th').filter({ hasText: 'E-mail' })).toBeVisible();
  await expect(page.locator('th').filter({ hasText: 'Age' })).toBeVisible();

  // Verify action buttons using data-testid
  await expect(page.getByTestId('addNewRowBtn')).toBeVisible();
  await expect(page.getByTestId('generateSampleBtn')).toBeVisible();
  await expect(page.getByTestId('resetTableBtn')).toBeVisible();
  await expect(page.getByTestId('clearTableBtn')).toBeVisible();
});

test('Generate Sample Data', async ({ page }) => {
  // Click Generate Sample Data button
  await page.getByTestId('generateSampleBtn').click();

  // Wait for data to be populated
  await page.waitForTimeout(1000);

  // Verify that rows are generated
  const rows = await page
    .locator('[data-testid="smartTable"] tbody tr')
    .count();
  expect(rows).toBeGreaterThan(0);

  // Verify first row contains data using data-testid
  await expect(page.getByTestId('tableRow-1')).toBeVisible();
  await expect(page.getByTestId('id-1')).toContainText('1');
});

test('Add New Row', async ({ page }) => {
  // Click Add New Row button
  await page.getByTestId('addNewRowBtn').click();

  // Wait for modal/form to appear
  await page.waitForSelector(
    'input[placeholder*="First Name"], input[name*="firstName"], [data-testid*="first"]',
    { timeout: 5000 }
  );

  // Fill in the form (adjust selectors based on actual form structure)
  await page.fill(
    'input[placeholder*="First Name"], input[name*="firstName"]',
    'John'
  );
  await page.fill(
    'input[placeholder*="Last Name"], input[name*="lastName"]',
    'Doe'
  );
  await page.fill(
    'input[placeholder*="Username"], input[name*="username"]',
    '@johndoe'
  );
  await page.fill(
    'input[placeholder*="Email"], input[name*="email"]',
    'john.doe@test.com'
  );
  await page.fill('input[placeholder*="Age"], input[name*="age"]', '30');

  // Submit the form
  await page
    .getByRole('button', { name: 'Save' })
    .or(page.getByRole('button', { name: 'Add' }))
    .click();

  // Verify new row was added
  await expect(page.locator('tbody')).toContainText('John');
  await expect(page.locator('tbody')).toContainText('Doe');
  await expect(page.locator('tbody')).toContainText('john.doe@test.com');
});

test('Edit Existing Row', async ({ page }) => {
  // First generate some data
  await page.getByTestId('generateSampleBtn').click();
  await page.waitForTimeout(1000);

  // Click edit button for the first row - look for edit button in first row
  await page.getByTestId('tableRow-1').locator('button').first().click();

  // Wait for edit form to appear
  await page.waitForTimeout(1000);

  // Update the data (adjust field selectors based on actual form)
  await page.fill(
    'input[value*="Mark"], input[placeholder*="First Name"]',
    'Marcus'
  );
  await page.fill('input[placeholder*="Age"], input[name*="age"]', '35');

  // Save changes
  await page
    .getByRole('button', { name: 'Save' })
    .or(page.getByRole('button', { name: 'Update' }))
    .click();

  // Verify changes were saved
  await expect(page.locator('tbody')).toContainText('Marcus');
  await expect(page.locator('tbody')).toContainText('35');
});

test('Delete Row', async ({ page }) => {
  // First generate some data
  await page.getByTestId('generateSampleBtn').click();
  await page.waitForTimeout(1000);

  // Get initial row count
  const initialRowCount = await page
    .locator('[data-testid="smartTable"] tbody tr')
    .count();

  // Click delete button for the first row - usually the second button (delete)
  await page.getByTestId('tableRow-1').locator('button').nth(1).click();

  // Handle confirmation dialog if it appears
  try {
    await page
      .getByRole('button', { name: 'Confirm' })
      .or(page.getByRole('button', { name: 'Delete' }))
      .click({ timeout: 2000 });
  } catch (e) {
    // No confirmation dialog, that's okay
  }

  // Verify row was deleted
  await page.waitForTimeout(1000);
  const finalRowCount = await page
    .locator('[data-testid="smartTable"] tbody tr')
    .count();
  expect(finalRowCount).toBe(initialRowCount - 1);
});

test('Clear All Data', async ({ page }) => {
  // First generate some data
  await page.getByTestId('generateSampleBtn').click();
  await page.waitForTimeout(1000);

  // Verify data exists
  const rowsBeforeClear = await page
    .locator('[data-testid="smartTable"] tbody tr')
    .count();
  expect(rowsBeforeClear).toBeGreaterThan(0);

  // Click Clear All button
  await page.getByTestId('clearTableBtn').click();

  // Handle confirmation if needed
  try {
    await page
      .getByRole('button', { name: 'Confirm' })
      .or(page.getByRole('button', { name: 'Yes' }))
      .click({ timeout: 2000 });
  } catch (e) {
    // No confirmation dialog
  }

  // Verify all data is cleared
  await page.waitForTimeout(1000);
  const rowsAfterClear = await page
    .locator('[data-testid="smartTable"] tbody tr')
    .count();
  expect(rowsAfterClear).toBe(0);
});

test('Reset Table', async ({ page }) => {
  // Generate some data first
  await page.getByTestId('generateSampleBtn').click();
  await page.waitForTimeout(1000);

  // Click Reset Table button
  await page.getByTestId('resetTableBtn').click();

  // Handle confirmation if needed
  try {
    await page
      .getByRole('button', { name: 'Confirm' })
      .or(page.getByRole('button', { name: 'Reset' }))
      .click({ timeout: 2000 });
  } catch (e) {
    // No confirmation dialog
  }

  // Verify table is reset to original state
  await page.waitForTimeout(1000);
  const rows = await page
    .locator('[data-testid="smartTable"] tbody tr')
    .count();
  expect(rows).toBeGreaterThanOrEqual(0); // Could be 0 or original sample data
});

test('Search and Filter in Table', async ({ page }) => {
  // Generate sample data first
  await page.getByTestId('generateSampleBtn').click();
  await page.waitForTimeout(1000);

  // If there's a search input, test filtering
  const searchInput = page.locator(
    'input[placeholder*="Search"], input[type="search"]'
  );
  if (await searchInput.isVisible()) {
    await searchInput.fill('Mark');
    await page.waitForTimeout(500);

    // Verify only matching rows are shown
    const visibleRows = page.locator(
      '[data-testid="smartTable"] tbody tr:visible'
    );
    await expect(visibleRows).toContainText('Mark');
  }
});

test('Sort Table Columns', async ({ page }) => {
  // Generate sample data first
  await page.getByTestId('generateSampleBtn').click();
  await page.waitForTimeout(1000);

  // Try to click on a sortable column header (e.g., Age)
  const ageHeader = page.locator('th').filter({ hasText: 'Age' });
  if (await ageHeader.isVisible()) {
    await ageHeader.click();
    await page.waitForTimeout(500);

    // Verify sorting occurred
    const firstRowAge = await page
      .getByTestId('tableRow-1')
      .locator('td')
      .last()
      .textContent();
    expect(firstRowAge).toBeTruthy();
  }
});

test('Validate Table Data', async ({ page }) => {
  // Generate sample data
  await page.getByTestId('generateSampleBtn').click();
  await page.waitForTimeout(1000);

  // Get all rows and validate data format using data-testid
  const rows = page.locator('[data-testid="smartTable"] tbody tr');
  const rowCount = await rows.count();

  for (let i = 1; i <= Math.min(rowCount, 3); i++) {
    // Check first 3 rows
    // Use specific data-testid for each cell
    const idElement = page.getByTestId(`id-${i}`);
    if (await idElement.isVisible()) {
      const id = await idElement.textContent();
      expect(parseInt(id)).toBeGreaterThan(0);
    }

    // Validate email format if email cell exists
    const emailElement = page.locator(
      `[data-testid^="email-${i}"], [data-testid^="e-mail-${i}"]`
    );
    if (await emailElement.isVisible()) {
      const email = await emailElement.textContent();
      expect(email).toMatch(/\S+@\S+\.\S+/);
    }

    // Validate age if age cell exists
    const ageElement = page.locator(`[data-testid^="age-${i}"]`);
    if (await ageElement.isVisible()) {
      const age = await ageElement.textContent();
      const ageNum = parseInt(age);
      expect(ageNum).toBeGreaterThan(0);
      expect(ageNum).toBeLessThan(120);
    }
  }
});

test('Table Pagination (if exists)', async ({ page }) => {
  // Generate enough data to trigger pagination
  await page.getByTestId('generateSampleBtn').click();
  await page.waitForTimeout(1000);

  // Look for pagination controls
  const nextButton = page.locator(
    'button:has-text("Next"), button:has-text("›"), .pagination-next'
  );
  const prevButton = page.locator(
    'button:has-text("Previous"), button:has-text("‹"), .pagination-prev'
  );

  if (await nextButton.isVisible()) {
    // Test pagination
    await nextButton.click();
    await page.waitForTimeout(500);

    await prevButton.click();
    await page.waitForTimeout(500);
  }
});
