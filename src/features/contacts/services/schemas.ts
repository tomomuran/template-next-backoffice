import { z } from "zod";

export const contactStatuses = ["lead", "active", "archived"] as const;

export const contactFormSchema = z.object({
  firstName: z.string().trim().min(1, "名は必須です"),
  lastName: z.string().trim().min(1, "姓は必須です"),
  companyName: z.string().trim().min(1, "会社名は必須です"),
  email: z.string().trim().email("メールアドレスの形式が不正です"),
  phone: z.string().trim().min(1, "電話番号は必須です"),
  status: z.enum(contactStatuses),
  notes: z.string().trim().max(2000, "メモは 2000 文字以内です").default("")
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export interface ContactRecord {
  id: string;
  first_name: string;
  last_name: string;
  company_name: string;
  email: string;
  phone: string;
  status: (typeof contactStatuses)[number];
  notes: string | null;
  created_at: string;
  updated_at: string;
}
