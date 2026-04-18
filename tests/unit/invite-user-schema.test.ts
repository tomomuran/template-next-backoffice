import { describe, expect, it } from "vitest";
import { inviteUserSchema } from "@/features/users/services/schemas";

describe("inviteUserSchema", () => {
  it("正常な入力を受け入れる", () => {
    const result = inviteUserSchema.safeParse({
      email: "test@example.com",
      displayName: "Test User",
      role: "member"
    });
    expect(result.success).toBe(true);
  });

  it("不正なメールアドレスを拒否する", () => {
    const result = inviteUserSchema.safeParse({
      email: "invalid",
      displayName: "Test User",
      role: "member"
    });
    expect(result.success).toBe(false);
  });

  it("空の表示名を拒否する", () => {
    const result = inviteUserSchema.safeParse({
      email: "test@example.com",
      displayName: "",
      role: "member"
    });
    expect(result.success).toBe(false);
  });

  it("不正なロールを拒否する", () => {
    const result = inviteUserSchema.safeParse({
      email: "test@example.com",
      displayName: "Test User",
      role: "superadmin"
    });
    expect(result.success).toBe(false);
  });

  it("admin ロールを受け入れる", () => {
    const result = inviteUserSchema.safeParse({
      email: "admin@example.com",
      displayName: "Admin User",
      role: "admin"
    });
    expect(result.success).toBe(true);
  });
});
