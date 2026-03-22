import { test, expect } from "@playwright/test";
import { signInAsAdmin } from "@/../tests/e2e/support";

test("root page shows template heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /concrete template/i })).toBeVisible();
});

test("seeded admin can sign in and see contacts", async ({ page }) => {
  await signInAsAdmin(page);
  await page.getByRole("link", { name: "Contacts" }).click();
  await expect(page).toHaveURL(/\/contacts$/);
  await expect(page.getByRole("heading", { name: "Contacts" })).toBeVisible();
  await expect(page.getByText("hanako@example.com")).toBeVisible();
});

test("contacts table supports search, filter, sort, paging, csv export", async ({ page }) => {
  await signInAsAdmin(page);
  await page.goto("/contacts");

  await page.getByLabel("連絡先検索").fill("Hanako");
  await expect(page.getByText("hanako@example.com")).toBeVisible();
  await expect(page.getByText("taro@example.com")).not.toBeVisible();

  await page.getByLabel("ステータス").selectOption("lead");
  await expect(page.getByText("taro@example.com")).not.toBeVisible();

  await page.getByLabel("連絡先検索").fill("");
  await page.getByLabel("ステータス").selectOption("");
  await page.getByRole("button", { name: "Updated" }).click();
  await expect(page.getByRole("cell", { name: /hanako@example.com/i }).first()).toBeVisible();

  await page.getByLabel("表示件数").selectOption("1");
  await expect(page.getByText("1-1 / 2 件")).toBeVisible();
  await page.getByRole("main").getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByText("2-2 / 2 件")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "CSV Export" }).click();
  const download = await downloadPromise;
  await expect(download.suggestedFilename()).toBe("contacts.csv");
});

test("admin can create, edit, and delete a contact", async ({ page }) => {
  const uniqueEmail = `crud-runner-${Date.now()}@example.com`;
  await signInAsAdmin(page);
  await page.goto("/contacts");
  await page.getByRole("main").getByRole("link", { name: "New Contact" }).click();

  await page.locator("#contact-last-name").fill("Crud");
  await page.locator("#contact-first-name").fill("Runner");
  await page.locator("#contact-company-name").fill("Template QA");
  await page.locator("#contact-email").fill(uniqueEmail);
  await page.locator("#contact-phone").fill("090-1111-2222");
  await page.locator("#contact-status").selectOption("active");
  await page.locator("#contact-notes").fill("created by playwright");
  await page.getByRole("button", { name: "Create" }).click();

  await expect(page).toHaveURL(/\/contacts$/);
  await page.getByRole("link", { name: /Crud Runner/i }).click();
  await page.getByRole("link", { name: "Edit" }).click();

  await page.locator("#contact-notes").fill("updated by playwright");
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByRole("link", { name: /Crud Runner/i }).click();
  await expect(page.getByText("updated by playwright")).toBeVisible();

  await page.getByRole("button", { name: "Delete" }).click();
  await expect(page).toHaveURL(/\/contacts$/);
  await expect(page.getByText(uniqueEmail)).not.toBeVisible();
});

test("dirty contact form warns before cancel", async ({ page }) => {
  await signInAsAdmin(page);
  await page.goto("/contacts/new");
  await page.evaluate(() => {
    const confirmMessages: string[] = [];
    Object.defineProperty(window, "__confirmMessages", {
      value: confirmMessages,
      configurable: true
    });
    window.confirm = (message?: string) => {
      confirmMessages.push(message ?? "");
      return false;
    };
  });

  await page.locator("#contact-last-name").fill("Unsaved");
  await page.getByRole("button", { name: "Cancel" }).click();
  const confirmMessages = await page.evaluate(() => (window as Window & { __confirmMessages?: string[] }).__confirmMessages ?? []);
  expect(confirmMessages[0]).toContain("未保存の変更があります");
  await expect(page).toHaveURL(/\/contacts\/new$/);
});
