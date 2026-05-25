import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir:   './e2e',
  outputDir: './screenshots',
  timeout:   30_000,
  expect:    { timeout: 10_000 },
  retries:   process.env.CI ? 1 : 0,
  workers:   1,
  use: {
    baseURL:    process.env.APP_URL || 'http://localhost:3002',
    headless:   true,
    screenshot: 'on',
    locale:     'pt-BR',
    viewport:   { width: 1280, height: 720 }
  },
  projects: [
    {
      name: 'chromium',
      use:  { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: process.env.CI ? undefined : {
    command:             'npm run preview -- --port 3002',
    url:                 'http://localhost:3002',
    reuseExistingServer: true,
    timeout:             30_000
  }
});
