import { expect, type Page, type Locator } from "@playwright/test";

export async function expectEnabled(locator: Locator, timeout = 10_000) {
  await expect(locator).toBeEnabled({ timeout });
}

export async function signInAsAdmin(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill("admin@example.com");
  await page.getByLabel("Password").fill("ChangeMe123!");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });
}
