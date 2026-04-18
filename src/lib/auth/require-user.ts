import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAppRole, isUserStatus, type UserProfile } from "@/lib/auth/roles";

const getSupabaseServerClient = cache(async () => {
  return createSupabaseServerClient();
});

export const requireAuthenticatedUser = cache(async () => {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { user, supabase };
});

export const getCurrentUserProfile = cache(async (): Promise<UserProfile | null> => {
  const { user, supabase } = await requireAuthenticatedUser();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("id, role, status, display_name")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(`ユーザープロフィールの取得に失敗しました: ${error.message}`);
  }

  if (!data || !isAppRole(data.role) || !isUserStatus(data.status)) {
    return null;
  }

  return data;
});

export async function requireRole(allowedRoles: UserProfile["role"][]) {
  const profile = await getCurrentUserProfile();

  if (!profile || !allowedRoles.includes(profile.role)) {
    redirect("/dashboard");
  }

  return profile;
}
