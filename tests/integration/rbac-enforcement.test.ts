import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("RBAC enforcement", () => {
  const contactActions = readFileSync(resolve(process.cwd(), "src/features/contacts/actions.ts"), "utf-8");

  it("deleteContactAction は admin ロールを要求する", () => {
    const deleteSection = contactActions.slice(contactActions.indexOf("deleteContactAction"));
    expect(deleteSection).toContain('requireRole(["admin"])');
  });

  it("deleteContactAndRedirectAction は admin ロールを要求する", () => {
    const deleteRedirectSection = contactActions.slice(contactActions.indexOf("deleteContactAndRedirectAction"));
    expect(deleteRedirectSection).toContain('requireRole(["admin"])');
  });

  it("requireRole のインポートが存在する", () => {
    expect(contactActions).toContain("import { requireRole }");
  });

  it("監査ログページは admin のみアクセス可能", () => {
    const auditLogPage = readFileSync(
      resolve(process.cwd(), "src/app/(app)/audit-logs/page.tsx"),
      "utf-8"
    );
    expect(auditLogPage).toContain('requireRole(["admin"])');
  });
});
