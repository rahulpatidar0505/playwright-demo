import { test, expect } from '@playwright/test';

test.beforeEach('Navigate and verify the title', async ({ page }) => {
  await page.goto('https://zenetratechnologies.com/practice-app');
  await expect(page).toHaveTitle(/Playwright Practice Application/);
  await page.getByRole('button', { name: 'Accept All' }).click();
  await page.getByText('🪟Modals').click();
});

test('Handle Dialogue', async ({ page }) => {
  await page.getByTestId('openDialog').click();
  await page.getByTestId('dialogConfirm').click();
});

test('Handle Window', async ({ page }) => {
  await page.getByTestId('openWindow').click();
  await page.getByTestId('windowInput').click();
  await page.getByTestId('windowInput').fill('testing123');
  await page.getByTestId('windowSelect').selectOption('option2');
  await page.getByTestId('windowCheckbox').check();
  await page.getByTestId('windowSave').click();
});

test('Handle Popover', async ({ page }) => {
  await page.getByTestId('togglePopover').click();
  await page.getByText('This is a popover content').textContent();
  expect(await page.getByText('This is a popover content').textContent()).toBe(
    'This is a popover content example. You can test automation interactions with this element.'
  );
  await page.getByRole('button', { name: 'Close' }).click();
});

test('Handle Toastr Notifications', async ({ page }) => {
  await page.getByTestId('successToastr').click();
  expect(
    await page.getByText('Success! Operation completed').isVisible()
  ).toBeTruthy();
  await page.getByTestId('toastrClose').click();

  await page.getByTestId('warningToastr').click();
  expect(
    await page.getByText('Warning! Please check your input').isVisible()
  ).toBeTruthy();
  await page.getByTestId('toastrClose').click();
});

test('Handle Tooltip', async ({ page }) => {
  // Hover over the trigger element to show tooltip
  await page.getByTestId('tooltipTrigger').hover();

  // Wait for tooltip to appear and become visible
  await page.waitForSelector('[data-testid="tooltipContent"]', {
    state: 'visible',
  });

  // Verify tooltip text is visible
  const tooltipText =
    'This is a tooltip that appears on hover or click. Perfect for automation testing!';
  await expect(page.getByText(tooltipText)).toBeVisible();
});

test('Simple Alert', async ({ page }) => {
  page.on('dialog', async dialog => {
    console.log(dialog.message());
    await dialog.accept();
  });
  await page.getByRole('button', { name: 'Simple Alert' }).click();
});

test('Confirm Alert', async ({ page }) => {
  page.on('dialog', async dialog => {
    console.log(dialog.message());
    await dialog.accept(); // Use dialog.dismiss() to cancel
  });
  await page.getByRole('button', { name: 'Confirm Dialog' }).click();
});

test('Prompt Dialog', async ({ page }) => {
  page.once('dialog', async dialog => {
    console.log(dialog.message());
    await dialog.accept('Hello Playwright');
  });
  await page.getByRole('button', { name: 'Prompt Dialog' }).click();
});

test('Handle New Tab', async ({ page, context }) => {
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.click('[data-testid="openNewTab"]'),
  ]);
  await newPage.waitForLoadState();
  console.log(await newPage.title());
});

test('Handle New Window', async ({ page, context }) => {
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.click('[data-testid="openNewWindow"]'),
  ]);
  await newPage.waitForLoadState();
  console.log(await newPage.title());
});

test('Open External Site', async ({ page, context }) => {
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.click('[data-testid="openExternalLink"]'),
  ]);
  await newPage.waitForLoadState();
  await expect(newPage).toHaveURL('https://playwright.dev/');
});
