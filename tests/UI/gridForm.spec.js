import { test, expect } from '@playwright/test';

test.beforeEach('Navigate and verify the title', async ({ page }) => {
  await page.goto('https://zenetratechnologies.com/practice-app');
  await expect(page).toHaveTitle(/Playwright Practice Application/);
});

test.describe('Form Grid Tests', () => {
  test('Verify successful form submission with all valid data', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Accept All' }).click();
    await page.getByPlaceholder('First Name').fill('John');
    await page.getByPlaceholder('Last Name').fill('Doe');
    await page.getByPlaceholder('Email').fill('john.doe@example.com');
    await page.getByTestId('country').selectOption('Germany');
    await page.getByTestId('city').selectOption('Tokyo');
    await page.getByTestId('jobRole').fill('QA');
    await page.getByTestId('experience').selectOption('10+ years');
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(
      page.getByText('Grid form submitted successfully!')
    ).toBeVisible();
  });
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:4200/practice-app');
  await page.getByRole('button', { name: 'Accept All' }).click();
  await page.getByTestId('firstName').fill('Rahul');
  await page.getByTestId('lastName').fill('Patidar');
  await page.getByTestId('gridEmail').fill('xyz@gmail.com');
  await page.getByText('Country *', { exact: true }).click();
  await page.getByTestId('country').selectOption('India');
  await page.getByTestId('city').selectOption('Sydney');
  await page.getByTestId('jobRole').fill('Junior QA');
  await page.getByTestId('experience').selectOption('0-1 years');
  await page.getByTestId('gridSubmit').click();
});
