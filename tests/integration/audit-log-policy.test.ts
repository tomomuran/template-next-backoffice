import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("audit log policy", () => {
  const migrationSql = readFileSync(resolve(process.cwd(), "supabase/migrations/0001_init.sql"), "utf-8");
  const contactService = readFileSync(resolve(process.cwd(), "src/features/contacts/services/contacts-service.ts"), "utf-8");
  const profileActions = readFileSync(resolve(process.cwd(), "src/features/profile/actions.ts"), "utf-8");

  it("audit_logs は admin のみ select できる", () => {
    expect(migrationSql).toContain('create policy "audit_logs_select_admin_only"');
    expect(migrationSql).toContain("using (public.is_admin())");
  });

  it("contacts の create/update/delete で audit log を残す", () => {
    expect(contactService.match(/recordAuditLog\(supabase/g)?.length).toBe(3);
  });

  it("soft delete の可視性は service 層で制御する", () => {
    expect(migrationSql).toContain('create policy "contacts_read_authenticated"');
    expect(migrationSql).toContain("using (auth.uid() is not null);");
    expect(contactService.match(/\.is\(\"deleted_at\", null\)/g)?.length).toBe(2);
  });

  it("profile 更新でも audit log を残す", () => {
    expect(profileActions).toContain("recordAuditLog(supabase");
    expect(profileActions).toContain('action: "update_profile"');
  });
});
