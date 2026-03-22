import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("supabase local auth seed", () => {
  it("defines seeded admin and member credentials", () => {
    const seedSql = readFileSync(resolve(process.cwd(), "supabase/seed.sql"), "utf-8");

    expect(seedSql).toContain("admin@example.com");
    expect(seedSql).toContain("member@example.com");
    expect(seedSql).toContain("ChangeMe123!");
    expect(seedSql).toContain("insert into auth.users");
    expect(seedSql).toContain("insert into auth.identities");
    expect(seedSql).toContain("insert into public.user_profiles");
  });
});
