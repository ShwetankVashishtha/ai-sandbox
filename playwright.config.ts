import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Playwright configuration
 *
 * Designed to work with:
 * - Local execution
 * - GitLab CI
 * - GitHub Actions
 * - Jenkins
 */

export default defineConfig({
  // Test directory
  testDir: './tests',

  // Run test files in parallel
  fullyParallel: true,

  // Fail CI if test.only is accidentally committed
  forbidOnly: !!process.env.CI,

  // Retry failed tests only in CI
  retries: process.env.CI ? 1 : 0,

  // Use fewer workers in CI to avoid overloading CI runners
  workers: process.env.CI ? 1 : 2,

  // Global test timeout
  timeout: 30_000,

  // Expect assertion timeout
  expect: {
    timeout: 10_000,
  },

  // Reports
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],

  // Shared browser settings
  use: {
    // Headless is suitable for local and CI execution
    headless: true,

    // Useful for environments with self-signed/invalid certificates
    ignoreHTTPSErrors: true,

    // Maximum time for individual actions
    actionTimeout: 10_000,

    // Maximum time for navigation
    navigationTimeout: 30_000,

    // Capture trace for failed tests
    trace: 'retain-on-failure',

    // Capture screenshot for failed tests
    screenshot: 'only-on-failure',

    // Capture video for failed tests
    video: 'retain-on-failure',
  },

  // Browser projects
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    // Enable when cross-browser testing is required
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //   },
    // },

    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //   },
    // },
  ],
});