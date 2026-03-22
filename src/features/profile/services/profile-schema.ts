import { z } from "zod";

export const profileFormSchema = z.object({
  displayName: z.string().trim().min(1, "表示名は必須です").max(120, "表示名は 120 文字以内です")
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
