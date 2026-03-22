import { ProfileForm } from "@/features/profile/components/profile-form";
import { updateProfileAction } from "@/features/profile/actions";
import { getCurrentUserProfile, requireAuthenticatedUser } from "@/lib/auth/require-user";

export default async function AccountPage() {
  const { user } = await requireAuthenticatedUser();
  const profile = await getCurrentUserProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
        <p className="text-sm text-muted-foreground">プロフィール管理</p>
      </div>
      <ProfileForm
        defaultValues={{
          displayName: profile?.display_name ?? ""
        }}
        email={user.email ?? ""}
        role={profile?.role ?? "member"}
        status={profile?.status ?? "invited"}
        submitAction={updateProfileAction}
      />
    </div>
  );
}
