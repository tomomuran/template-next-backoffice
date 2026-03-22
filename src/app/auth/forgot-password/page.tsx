import Link from "next/link";
import { Button } from "@/components/ui/button";
import { requestPasswordResetAction } from "@/features/auth/actions";
import { PasswordResetRequestForm } from "@/features/auth/components/password-reset-request-form";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-12">
      <PasswordResetRequestForm submitAction={requestPasswordResetAction} />
      <Button asChild variant="ghost">
        <Link href="/login">Back to Login</Link>
      </Button>
    </div>
  );
}
