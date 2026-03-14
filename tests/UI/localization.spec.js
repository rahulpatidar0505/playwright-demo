import { test, expect } from '@playwright/test';

test.describe('Localization Tests', () => {
  const locales = [
    {
      code: ' 🇺🇸 English ',
      language: 'English',
      expectedText: 'Welcome to Playwright Testing',
    },
    {
      code: ' 🇫🇷 Français ',
      language: 'French',
      expectedText: 'Bienvenue aux tests Playwright',
    },
    {
      code: ' 🇩🇪 Deutsch ',
      language: 'German',
      expectedText: 'Willkommen beim Playwright-Testing',
    },
  ];

  locales.forEach(({ code, language, expectedText }) => {
    test.only(`Verify ${language} translation`, async ({ page }) => {
      await page.goto('https://zenetratechnologies.com/practice-app');
      await page.getByRole('button', { name: 'Accept All' }).click();
      await page.getByText('Localization').click();
      await page.getByRole('button', { name: code }).click();
      await expect(page.getByTestId('translated-welcome')).toContainText(
        expectedText
      );
    });
  });
});
