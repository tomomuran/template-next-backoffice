import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe(".env.example", () => {
  const envExample = readFileSync(join(process.cwd(), ".env.example"), "utf8");

  it("analytics と sentry の optional env を含む", () => {
    expect(envExample).toContain("NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED=false");
    expect(envExample).toContain("NEXT_PUBLIC_SENTRY_DSN=");
    expect(envExample).toContain("SENTRY_DSN=");
  });

  it("ローカル検証用の Supabase key を含む", () => {
    expect(envExample).toContain("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_");
    expect(envExample).toContain("SUPABASE_SERVICE_ROLE_KEY=eyJ");
  });
});
