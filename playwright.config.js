require('dotenv').config();
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  // =====================================================
  // Test location
  // =====================================================
  testDir: './tests',

  // =====================================================
  // Reporting
  // =====================================================
  reporter: 'html',

  // =====================================================
  // Global timeouts
  // =====================================================
  timeout: 60_000,
  expect: { timeout: 15_000 },

  // =====================================================
  // Parallel execution
  // =====================================================
  fullyParallel: false,
  workers: 1,

  use: {
    // =====================================================
    // Base URL
    // =====================================================
    baseURL: process.env.BASE_URL,

    // =====================================================
    // Debug artifacts
    // =====================================================
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',

    // =====================================================
    // Timeouts
    // =====================================================
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  projects: [
    // =====================================================
    // Project: setup
    // =====================================================
    { name: 'setup', testMatch: /.*login\.setup\.spec\.js/ },

    // =====================================================
    // Project: chromium
    // =====================================================
    {
      name: 'chromium',
      dependencies: ['setup'],
      testIgnore: /.*\.setup\.spec\.js/,
      use: { storageState: 'auth/storageState.json' },
    },
  ],
});