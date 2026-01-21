import { test, expect } from '@playwright/test';

test.describe('Authentication Tests', () => {
  test('Handle Authentication - Save State', async ({ page }) => {
    await page.goto('https://zenetratechnologies.com/practice-app');

    // Wait for page to load and then accept cookies
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('button', { name: 'Accept All' })).toBeVisible({
      timeout: 10000,
    });
    await page.getByRole('button', { name: 'Accept All' }).click();

    await page.getByText('Authentication', { exact: true }).click();

    // Login and save authentication state
    await page.fill('[data-testid="auth-username-input"]', 'admin');
    await page.fill('[data-testid="auth-password-input"]', 'admin123');
    await page.click('[data-testid="login-submit-button"]');

    // Wait for successful login
    await expect(
      page.locator(
        '//span[text()="Successfully logged in as Admin User (admin). Session data saved to both localStorage and sessionStorage."]'
      )
    ).toBeVisible();

    // Save the authenticated state to file
    await page.context().storageState({
      path: './auth-state.json',
    });

    // State includes localStorage, sessionStorage, and cookies
    console.log('✅ Authentication state saved successfully!');
  });

  test('Use Authentication State', async ({ browser }) => {
    // Create new context with saved authentication state
    const context = await browser.newContext({
      storageState: './auth-state.json',
    });
    const page = await context.newPage();

    // Navigate to the application
    await page.goto('https://zenetratechnologies.com/practice-app');
    await page.waitForLoadState('domcontentloaded');

    // Navigate to authentication page
    await page.getByText('Authentication', { exact: true }).click();

    // Verify authentication state is active
    await expect(
      page.getByRole('heading', { name: '🔓 Active Session' })
    ).toBeVisible({ timeout: 10000 });

    // Navigate to protected page - user is already logged in!
    await page.getByTestId('protected-action-button').click();

    // No login required - ready to test protected features!
    await expect(
      page.getByText('Admin action: Full system access granted')
    ).toBeVisible();

    // Clean up context
    await context.close();
  });
});
