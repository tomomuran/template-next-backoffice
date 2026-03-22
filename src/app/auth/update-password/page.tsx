import { UpdatePasswordForm } from "@/features/auth/components/update-password-form";
import { updatePasswordAction } from "@/features/auth/actions";

export default function UpdatePasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <UpdatePasswordForm submitAction={updatePasswordAction} />
    </div>
  );
}
