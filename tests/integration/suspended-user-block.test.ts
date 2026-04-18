import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("suspended user block", () => {
  const layoutSrc = readFileSync(resolve(process.cwd(), "src/app/(app)/layout.tsx"), "utf-8");

  it("layout.tsx で status チェックを行う", () => {
    expect(layoutSrc).toContain('status !== "active"');
  });

  it("suspended ユーザーを /suspended にリダイレクトする", () => {
    expect(layoutSrc).toContain('"/suspended"');
    expect(layoutSrc).toContain("redirect(");
  });

  it("/suspended ページが存在する", () => {
    expect(existsSync(resolve(process.cwd(), "src/app/suspended/page.tsx"))).toBe(true);
  });

  it("/suspended ページにログアウト機能がある", () => {
    const suspendedPage = readFileSync(resolve(process.cwd(), "src/app/suspended/page.tsx"), "utf-8");
    expect(suspendedPage).toContain("signOutAction");
  });
});
