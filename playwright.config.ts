import { defineConfig, devices } from "@playwright/test";

const slot = Number(process.env.PROJECT_SLOT ?? 33);
const appPort = slot * 100;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  use: {
    baseURL:
      process.env.PLAYWRIGHT_BASE_URL ??
      process.env.NEXT_PUBLIC_APP_URL ??
      `http://127.0.0.1:${appPort}`,
    trace: "on-first-retry"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
