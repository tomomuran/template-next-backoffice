import { describe, expect, it } from "vitest";
import { contactFormSchema } from "@/features/contacts/services/schemas";

describe("contactFormSchema", () => {
  it("正常な payload を通す", () => {
    const result = contactFormSchema.parse({
      firstName: "Taro",
      lastName: "Template",
      companyName: "Open Field Inc.",
      email: "taro@example.com",
      phone: "03-1234-5678",
      status: "lead",
      notes: "memo"
    });

    expect(result.companyName).toBe("Open Field Inc.");
  });

  it("不正なメールアドレスを弾く", () => {
    const result = contactFormSchema.safeParse({
      firstName: "Taro",
      lastName: "Template",
      companyName: "Open Field Inc.",
      email: "invalid",
      phone: "03-1234-5678",
      status: "lead",
      notes: ""
    });

    expect(result.success).toBe(false);
  });
});
