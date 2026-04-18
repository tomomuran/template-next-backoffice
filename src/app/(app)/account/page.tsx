import { ProfileForm } from "@/features/profile/components/profile-form";
import { updateProfileAction } from "@/features/profile/actions";
import { getCurrentUserProfile, requireAuthenticatedUser } from "@/lib/auth/require-user";

export default async function AccountPage() {
  const { user } = await requireAuthenticatedUser();
  const profile = await getCurrentUserProfile();

  return (
    <div>
      <div className="border-b border-border px-5 py-3.5">
        <h1 className="text-[21px] font-semibold tracking-[-0.022em]">Settings</h1>
        <p className="mt-0.5 text-[13px] text-muted-foreground">
          ワークスペースと個人設定
        </p>
      </div>
      <div className="p-5">
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
    </div>
  );
}
