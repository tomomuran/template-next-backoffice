import { describe, expect, it } from "vitest";
import { profileFormSchema } from "@/features/profile/services/profile-schema";

describe("profileFormSchema", () => {
  it("正常な表示名を通す", () => {
    const result = profileFormSchema.parse({
      displayName: "Template User"
    });

    expect(result.displayName).toBe("Template User");
  });

  it("空の表示名を弾く", () => {
    const result = profileFormSchema.safeParse({
      displayName: ""
    });

    expect(result.success).toBe(false);
  });
});
