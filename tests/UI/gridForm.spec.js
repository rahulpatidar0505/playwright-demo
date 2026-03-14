import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

test.beforeEach('Navigate and verify the title', async ({ page }) => {
  await page.goto('https://zenetratechnologies.com/practice-app');
  await expect(page).toHaveTitle(/Playwright Practice Application/);
});

test('Verify successful form submission with all valid data', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Accept All' }).click();
  await page.getByPlaceholder('Enter first name (letters only)').fill('John');
  await page.getByPlaceholder('Enter last name (letters only)').fill('Doe');
  await page
    .getByPlaceholder('Enter email address (e.g., user@example.com)')
    .fill('john.doe@example.com');
  await page.getByTestId('country').selectOption('India');
  await page.getByTestId('city').selectOption('Tokyo');
  await page.getByTestId('jobRole').fill('QA');
  await page.getByTestId('experience').selectOption('10+ years');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(
    page.getByText('Grid form submitted successfully!')
  ).toBeVisible();
});

test.describe('Parameterized Tests - JSON Data', () => {
  // Read JSON test data from file
  const testData = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../../testData/form-test-data.json'),
      'utf-8'
    )
  );

  // Loop through each test data and create a test
  testData.forEach(abc => {
    test(`Verify form submission for user: ${abc.firstName} ${abc.lastName}`, async ({
      page,
    }) => {
      await page.getByRole('button', { name: 'Accept All' }).click();

      await page
        .getByPlaceholder('Enter first name (letters only)')
        .fill(abc.firstName);
      await page
        .getByPlaceholder('Enter last name (letters only)')
        .fill(abc.lastName);
      await page
        .getByPlaceholder('Enter email address (e.g., user@example.com)')
        .fill(abc.email);
      await page.getByTestId('country').selectOption(abc.country);
      await page.getByTestId('city').selectOption(abc.city);
      await page.getByTestId('jobRole').fill(abc.jobRole);
      await page.getByTestId('experience').selectOption(abc.experience);

      await page.getByRole('button', { name: 'Submit' }).click();

      await expect(
        page.getByText('Grid form submitted successfully!')
      ).toBeVisible();
    });
  });
});

test.describe('Parameterized Tests - CSV Data', () => {
  // Read and parse CSV test data from file (using csv-parse library)
  const csvDataPath = path.join(__dirname, '../../testData/form-test-data.csv');
  const csvContent = fs.readFileSync(csvDataPath, 'utf-8');
  const testData = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });

  // Loop through each test data and create a test
  testData.forEach(data => {
    test(`Verify form submission for CSV user: ${data.firstName} ${data.lastName}`, async ({
      page,
    }) => {
      await page.getByRole('button', { name: 'Accept All' }).click();

      await page
        .getByPlaceholder('Enter first name (letters only)')
        .fill(data.firstName);
      await page
        .getByPlaceholder('Enter last name (letters only)')
        .fill(data.lastName);
      await page
        .getByPlaceholder('Enter email address (e.g., user@example.com)')
        .fill(data.email);
      await page.getByTestId('country').selectOption(data.country);
      await page.getByTestId('city').selectOption(data.city);
      await page.getByTestId('jobRole').fill(data.jobRole);
      await page.getByTestId('experience').selectOption(data.experience);

      await page.getByRole('button', { name: 'Submit' }).click();

      await expect(
        page.getByText('Grid form submitted successfully!')
      ).toBeVisible();
    });
  });
});
