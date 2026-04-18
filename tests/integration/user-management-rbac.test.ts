import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("user management RBAC", () => {
  const userActions = readFileSync(resolve(process.cwd(), "src/features/users/actions.ts"), "utf-8");

  it("inviteUserAction は admin ロールを要求する", () => {
    expect(userActions).toContain('requireRole(["admin"])');
  });

  it("updateUserRoleAction は admin ロールを要求する", () => {
    const section = userActions.slice(userActions.indexOf("updateUserRoleAction"));
    expect(section).toContain('requireRole(["admin"])');
  });

  it("updateUserStatusAction は admin ロールを要求する", () => {
    const section = userActions.slice(userActions.indexOf("updateUserStatusAction"));
    expect(section).toContain('requireRole(["admin"])');
  });

  it("ユーザー管理ページは admin のみアクセス可能", () => {
    const usersPage = readFileSync(resolve(process.cwd(), "src/app/(app)/users/page.tsx"), "utf-8");
    expect(usersPage).toContain('requireRole(["admin"])');
  });
});
