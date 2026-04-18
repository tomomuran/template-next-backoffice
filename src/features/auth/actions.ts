"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerActionClient, createSupabaseServerClient } from "@/lib/supabase/server";

export interface AuthActionResult {
  error?: string;
  success?: string;
}

const signInSchema = z.object({
  email: z.string().trim().email("メールアドレスの形式が不正です"),
  password: z.string().min(8, "パスワードは 8 文字以上です")
});

export async function signInWithPasswordAction(values: {
  email: string;
  password: string;
}): Promise<AuthActionResult> {
  const supabase = await createSupabaseServerActionClient();
  const { error, data } = await supabase.auth.signInWithPassword(values);

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("status")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profile?.status === "suspended") {
      await supabase.auth.signOut();
      return { error: "このアカウントは停止されています。管理者にお問い合わせください。" };
    }
  }

  return {};
}

export async function signInWithPasswordFormAction(formData: FormData) {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    redirect(`/login?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "入力内容を確認してください")}`);
  }

  const result = await signInWithPasswordAction(parsed.data);

  if (result.error) {
    redirect(`/login?error=${encodeURIComponent(result.error)}`);
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createSupabaseServerActionClient();
  await supabase.auth.signOut();
}

export async function requestPasswordResetAction(email: string): Promise<AuthActionResult> {
  const supabase = await createSupabaseServerClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3300";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/auth/confirm?next=/auth/update-password`
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: "パスワード再設定メールを送信しました。受信メールのリンクを確認してください。"
  };
}

export async function updatePasswordAction(password: string): Promise<AuthActionResult> {
  const supabase = await createSupabaseServerActionClient();
  const { error, data } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("status")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profile?.status === "invited") {
      await supabase
        .from("user_profiles")
        .update({ status: "active", updated_by: data.user.id })
        .eq("id", data.user.id);
    }
  }

  revalidatePath("/", "layout");

  return {
    success: "パスワードを更新しました。"
  };
}
