import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("contact form error handling", () => {
  const source = readFileSync(resolve(process.cwd(), "src/features/contacts/components/contact-form.tsx"), "utf-8");

  it("server action 失敗時に root error を設定して toast を出す", () => {
    expect(source).toContain('form.setError("root.serverError"');
    expect(source).toContain("toast.error(message)");
  });

  it("server error をフォーム上に表示する", () => {
    expect(source).toContain("form.formState.errors.root?.serverError?.message");
  });
});
