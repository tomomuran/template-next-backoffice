import { requireAuthenticatedUser } from "@/lib/auth/require-user";
import type { AppRole, UserStatus } from "@/lib/auth/roles";
import { recordAuditLog, toJsonValue } from "@/lib/services/audit-log-service";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { getPublicEnv } from "@/lib/env/schema";
import { inviteUserSchema, type InviteUserFormValues } from "@/features/users/services/schemas";

export interface UserRecord {
  id: string;
  email: string;
  display_name: string | null;
  role: AppRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export async function listUsers(): Promise<UserRecord[]> {
  const serviceRole = createServiceRoleClient();

  const { data: profiles, error: profileError } = await serviceRole
    .from("user_profiles")
    .select("id, display_name, role, status, created_at, updated_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (profileError) {
    throw new Error(`ユーザー一覧の取得に失敗しました: ${profileError.message}`);
  }

  if (!profiles || profiles.length === 0) {
    return [];
  }

  const emailMap = new Map<string, string>();
  let page = 1;
  const perPage = 50;
  while (true) {
    const { data: authUsers } = await serviceRole.auth.admin.listUsers({ page, perPage });
    if (!authUsers.users.length) break;
    for (const u of authUsers.users) {
      emailMap.set(u.id, u.email ?? "");
    }
    if (authUsers.users.length < perPage) break;
    page++;
  }

  return profiles.map((p) => ({
    ...p,
    email: emailMap.get(p.id) ?? ""
  })) as UserRecord[];
}

export async function getUserById(userId: string): Promise<UserRecord | null> {
  const serviceRole = createServiceRoleClient();

  const { data: profile, error } = await serviceRole
    .from("user_profiles")
    .select("id, display_name, role, status, created_at, updated_at")
    .eq("id", userId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    throw new Error(`ユーザーの取得に失敗しました: ${error.message}`);
  }

  if (!profile) return null;

  const { data: authUser } = await serviceRole.auth.admin.getUserById(userId);

  return {
    ...profile,
    email: authUser.user?.email ?? ""
  } as UserRecord;
}

export async function inviteUser(values: InviteUserFormValues) {
  const parsed = inviteUserSchema.parse(values);
  const { user } = await requireAuthenticatedUser();
  const serviceRole = createServiceRoleClient();
  const env = getPublicEnv();

  const { data: authData, error: authError } = await serviceRole.auth.admin.inviteUserByEmail(parsed.email, {
    redirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/confirm?next=/auth/update-password`
  });

  if (authError) {
    throw new Error(`招待メールの送信に失敗しました: ${authError.message}`);
  }

  const newUserId = authData.user.id;

  const { error: profileError } = await serviceRole.from("user_profiles").insert({
    id: newUserId,
    display_name: parsed.displayName,
    role: parsed.role,
    status: "invited",
    created_by: user.id,
    updated_by: user.id
  });

  if (profileError) {
    await serviceRole.auth.admin.deleteUser(newUserId);
    throw new Error(`ユーザープロフィールの作成に失敗しました: ${profileError.message}`);
  }

  const { supabase } = await requireAuthenticatedUser();
  await recordAuditLog(supabase, {
    actor: user.id,
    action: "invite",
    targetType: "user_profile",
    targetId: newUserId,
    before: null,
    after: toJsonValue({ email: parsed.email, displayName: parsed.displayName, role: parsed.role })
  });

  return { id: newUserId };
}

export async function updateUserRole(userId: string, role: AppRole) {
  const { user, supabase } = await requireAuthenticatedUser();
  const serviceRole = createServiceRoleClient();

  const before = await getUserById(userId);
  if (!before) throw new Error("対象のユーザーが見つかりません");

  const { error } = await serviceRole
    .from("user_profiles")
    .update({ role, updated_by: user.id })
    .eq("id", userId);

  if (error) {
    throw new Error(`ロールの変更に失敗しました: ${error.message}`);
  }

  await recordAuditLog(supabase, {
    actor: user.id,
    action: "update_role",
    targetType: "user_profile",
    targetId: userId,
    before: toJsonValue({ role: before.role }),
    after: toJsonValue({ role })
  });
}

export async function updateUserStatus(userId: string, status: UserStatus) {
  const { user, supabase } = await requireAuthenticatedUser();
  const serviceRole = createServiceRoleClient();

  const before = await getUserById(userId);
  if (!before) throw new Error("対象のユーザーが見つかりません");

  const { error } = await serviceRole
    .from("user_profiles")
    .update({ status, updated_by: user.id })
    .eq("id", userId);

  if (error) {
    throw new Error(`ステータスの変更に失敗しました: ${error.message}`);
  }

  await recordAuditLog(supabase, {
    actor: user.id,
    action: "update_status",
    targetType: "user_profile",
    targetId: userId,
    before: toJsonValue({ status: before.status }),
    after: toJsonValue({ status })
  });
}
