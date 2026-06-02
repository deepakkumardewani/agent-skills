import { defineConfig, devices } from '@playwright/test';

const previewPort = 4322;
const previewUrl = `http://localhost:${previewPort}`;

export default defineConfig({
  testDir: 'tests/e2e',
  use: {
    baseURL: previewUrl,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: `bun run preview -- --port ${previewPort}`,
    url: previewUrl,
    reuseExistingServer: !process.env.CI,
  },
});
