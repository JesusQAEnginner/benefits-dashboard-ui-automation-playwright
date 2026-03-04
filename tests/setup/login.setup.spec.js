const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('login setup - save session', async ({ page }) => {
  // =====================================================
  // Goal
  // =====================================================
  // This setup test logs in once and saves the authenticated session.
  // Other tests will reuse this session so they start already logged in.

  // =====================================================
  // Prepare storage folder for auth state
  // =====================================================
  fs.mkdirSync(path.resolve('auth'), { recursive: true });

  // =====================================================
  // Navigate to Login
  // =====================================================
  await page.goto('Account/Login');

  // =====================================================
  // Login using .env credentials
  // =====================================================
  await page.getByRole('textbox', { name: /username/i }).fill(process.env.UI_USERNAME);
  await page.getByRole('textbox', { name: /password/i }).fill(process.env.UI_PASSWORD);
  await page.getByRole('button', { name: /log in/i }).click();

  // =====================================================
  // Validate login was successful
  // =====================================================
  await expect(page).toHaveURL(/\/Benefits/i);
  await expect(page.locator('#employeesTable')).toBeVisible();

  // =====================================================
  // Save the authenticated session
  // =====================================================
  await page.context().storageState({ path: 'auth/storageState.json' });
});