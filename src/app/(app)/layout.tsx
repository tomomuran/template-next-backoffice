import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { AuthProvider } from "@/components/providers/auth-provider";
import { getCurrentUserProfile, requireAuthenticatedUser } from "@/lib/auth/require-user";

export default async function AppLayout({ children }: Readonly<{ children: ReactNode }>) {
  await requireAuthenticatedUser();
  const profile = await getCurrentUserProfile();

  if (!profile || profile.status !== "active") {
    redirect("/suspended" as "/login");
  }

  return (
    <AuthProvider profile={profile}>
      <AppShell profile={profile}>{children}</AppShell>
    </AuthProvider>
  );
}
