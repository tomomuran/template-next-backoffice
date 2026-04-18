import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const appDir = resolve(process.cwd(), "src/app");
const appGroupDir = resolve(appDir, "(app)");

describe("error boundaries and loading states", () => {
  it("global-error.tsx が存在する", () => {
    expect(existsSync(resolve(appDir, "global-error.tsx"))).toBe(true);
  });

  it("root not-found.tsx が存在する", () => {
    expect(existsSync(resolve(appDir, "not-found.tsx"))).toBe(true);
  });

  it("(app) グループに error.tsx が存在する", () => {
    expect(existsSync(resolve(appGroupDir, "error.tsx"))).toBe(true);
  });

  it("(app) グループに not-found.tsx が存在する", () => {
    expect(existsSync(resolve(appGroupDir, "not-found.tsx"))).toBe(true);
  });

  it("(app) グループに loading.tsx が存在する", () => {
    expect(existsSync(resolve(appGroupDir, "loading.tsx"))).toBe(true);
  });

  it("contacts ルートに loading.tsx が存在する", () => {
    expect(existsSync(resolve(appGroupDir, "contacts/loading.tsx"))).toBe(true);
  });

  it("dashboard ルートに loading.tsx が存在する", () => {
    expect(existsSync(resolve(appGroupDir, "dashboard/loading.tsx"))).toBe(true);
  });
});
