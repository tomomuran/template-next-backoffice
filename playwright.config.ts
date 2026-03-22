import { defineConfig, devices } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function resolveProjectSlot() {
  if (process.env.PROJECT_SLOT) {
    return Number(process.env.PROJECT_SLOT);
  }

  const envLocalPath = resolve(".env.local");
  if (!existsSync(envLocalPath)) {
    return 33;
  }

  const persistedSlot = readFileSync(envLocalPath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.startsWith("PROJECT_SLOT="))
    ?.split("=", 2)?.[1]
    ?.trim();

  return Number(persistedSlot ?? 33);
}

const slot = resolveProjectSlot();
const appPort = slot * 100;
const localBaseURL = `http://127.0.0.1:${appPort}`;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? localBaseURL;
const useManagedWebServer = !process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  use: {
    baseURL,
    trace: "on-first-retry"
  },
  webServer: useManagedWebServer
    ? {
        command: "pnpm dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000
      }
    : undefined,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
