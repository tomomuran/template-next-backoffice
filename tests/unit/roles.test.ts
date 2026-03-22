import { describe, expect, it } from "vitest";
import { APP_ROLES, isAppRole } from "@/lib/auth/roles";

describe("roles", () => {
  it("admin と member を標準ロールとして持つ", () => {
    expect(APP_ROLES).toEqual(["admin", "member"]);
  });

  it("既知のロールだけ true を返す", () => {
    expect(isAppRole("admin")).toBe(true);
    expect(isAppRole("member")).toBe(true);
    expect(isAppRole("viewer")).toBe(false);
  });
});
