import { z } from "zod";
import { APP_ROLES } from "@/lib/auth/roles";

export const inviteUserSchema = z.object({
  email: z.string().trim().email("メールアドレスの形式が不正です"),
  displayName: z.string().trim().min(1, "表示名は必須です").max(100, "表示名は100文字以内です"),
  role: z.enum(APP_ROLES, { message: "ロールが不正です" })
});

export type InviteUserFormValues = z.infer<typeof inviteUserSchema>;
