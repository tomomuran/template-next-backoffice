import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { getCurrentUserProfile, requireAuthenticatedUser } from "@/lib/auth/require-user";

export default async function AppLayout({ children }: Readonly<{ children: ReactNode }>) {
  await requireAuthenticatedUser();
  const profile = await getCurrentUserProfile();

  return <AppShell profile={profile}>{children}</AppShell>;
}
