import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/features/auth/actions";
import type { UserProfile } from "@/lib/auth/roles";
import { primarySampleFeature } from "@/lib/sample-features";

interface AppHeaderProps {
  profile: UserProfile | null;
}

export function AppHeader({ profile }: AppHeaderProps) {
  return (
    <header className="border-b border-border bg-background px-4 py-4 md:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Next.js Backoffice Template</p>
          <h1 className="text-lg font-semibold">{profile?.display_name ?? "Invited User"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={primarySampleFeature.newHref}>New {primarySampleFeature.singularLabel}</Link>
          </Button>
          <form action={signOutAction}>
            <Button type="submit" variant="ghost">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
