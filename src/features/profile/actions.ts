"use server";

import { revalidatePath } from "next/cache";
import { requireAuthenticatedUser } from "@/lib/auth/require-user";
import { profileFormSchema } from "@/features/profile/services/profile-schema";
import { recordAuditLog, toJsonValue } from "@/lib/services/audit-log-service";

export async function updateProfileAction(values: { displayName: string }) {
  const parsed = profileFormSchema.parse(values);
  const { user, supabase } = await requireAuthenticatedUser();

  const { data: before, error: beforeError } = await supabase
    .from("user_profiles")
    .select("id, display_name, role, status")
    .eq("id", user.id)
    .maybeSingle();

  if (beforeError) {
    throw new Error(`プロフィール取得に失敗しました: ${beforeError.message}`);
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .upsert({
      id: user.id,
      display_name: parsed.displayName,
      updated_by: user.id,
      created_by: before?.id ? before.id : user.id
    })
    .select("id, display_name, role, status")
    .single();

  if (error) {
    throw new Error(`プロフィール更新に失敗しました: ${error.message}`);
  }

  await recordAuditLog(supabase, {
    actor: user.id,
    action: "update_profile",
    targetType: "user_profile",
    targetId: user.id,
    before: toJsonValue(before),
    after: toJsonValue(data)
  });

  revalidatePath("/account");
  revalidatePath("/dashboard");
}
