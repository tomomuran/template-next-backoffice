import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { buildBootstrapEnv, buildTemplateAdoptionContent } from "../../scripts/bootstrap.mjs";

const temporaryDirectories: string[] = [];

afterEach(() => {
  while (temporaryDirectories.length > 0) {
    const directory = temporaryDirectories.pop();
    if (directory) {
      rmSync(directory, { recursive: true, force: true });
    }
  }
});

describe("bootstrap script helpers", () => {
  it(".env.local にローカル検証用の必須値を補完する", () => {
    const input = ["PROJECT_SLOT=41", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=", "SUPABASE_SERVICE_ROLE_KEY="].join("\n");
    const output = buildBootstrapEnv(input, 41);

    expect(output).toContain("PROJECT_SLOT=41");
    expect(output).toContain("NEXT_PUBLIC_APP_URL=http://127.0.0.1:4100");
    expect(output).toContain("NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:55410");
    expect(output).toContain("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_");
    expect(output).toContain("SUPABASE_SERVICE_ROLE_KEY=eyJ");
  });

  it("template-adoption の空欄を初期化する", () => {
    const content = [
      "# Template Adoption",
      "",
      "## 基本情報",
      "",
      "- ベーステンプレート版: `v0.1.0`",
      "- 生成日:",
      "- 担当者:"
    ].join("\n");

    const output = buildTemplateAdoptionContent(content, "0.2.0", "2026-03-22", "codex");
    expect(output).toContain("- ベーステンプレート版: `v0.2.0`");
    expect(output).toContain("- 生成日: 2026-03-22");
    expect(output).toContain("- 担当者: codex");
  });

  it("補完済みの env 値は壊さない", () => {
    const directory = mkdtempSync(join(tmpdir(), "bootstrap-test-"));
    temporaryDirectories.push(directory);

    const envPath = join(directory, ".env.local");
    writeFileSync(envPath, "PROJECT_SLOT=55\nNEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=custom\nSUPABASE_SERVICE_ROLE_KEY=custom\n");
    const output = buildBootstrapEnv(readFileSync(envPath, "utf8"), 55);

    expect(output).toContain("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=custom");
    expect(output).toContain("SUPABASE_SERVICE_ROLE_KEY=custom");
  });
});
