import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("supabase config", () => {
  const config = readFileSync(join(process.cwd(), "supabase/config.toml"), "utf8");

  it("self-signup は無効だが email provider は有効", () => {
    expect(config).toContain("enable_signup = false");
    expect(config).toContain("[auth.email]");
    expect(config).toContain("enable_signup = true");
  });

  it("seed を標準で有効にしている", () => {
    expect(config).toContain("[db.seed]");
    expect(config).toContain('sql_paths = ["./seed.sql"]');
  });
});
