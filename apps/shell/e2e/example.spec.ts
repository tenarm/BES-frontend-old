import { test, expect } from '@playwright/test';

test.describe('BES Shell E2E Setup Placeholder', () => {
  test('should load the sign-in page with correct branding title', async ({ page }) => {
    await page.goto('/');

    // Verify Business Execution System brand heading is visible
    const brandHeading = page.locator('h2:has-text("Business Execution System")');
    await expect(brandHeading).toBeVisible();

    // Verify Sign In controls are visible
    const usernameInput = page.locator('#login-username');
    const passwordInput = page.locator('#login-password');
    const submitBtn = page.locator('#login-submit');

    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();
  });
});
