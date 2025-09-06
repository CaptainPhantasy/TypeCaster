import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000, // 60 second timeout per test
  expect: {
    timeout: 10000 // 10 second timeout for assertions
  },
  fullyParallel: false, // Run tests sequentially for this simulation
  forbidOnly: !!(typeof process !== 'undefined' && process.env && process.env.CI),
  retries: 0, // No retries for user simulation
  workers: 1, // Single worker for observation
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }]
  ],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        headless: false,
        viewport: { width: 1280, height: 720 },
        launchOptions: {
          slowMo: 100 // Slow down actions for visibility
        }
      },
    },
  ],
});
