import type { ReactNode } from "react";
import { SidebarLayout } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import type { UserProfile } from "@/lib/auth/roles";

interface AppShellProps {
  profile: UserProfile | null;
  children: ReactNode;
}

export function AppShell({ profile, children }: AppShellProps) {
  return <SidebarLayout sidebar={<AppSidebar />} header={<AppHeader profile={profile} />}>{children}</SidebarLayout>;
}
