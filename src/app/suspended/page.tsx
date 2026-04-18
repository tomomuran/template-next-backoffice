import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signOutAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";

export default function SuspendedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Account Suspended</CardTitle>
          <CardDescription>
            このアカウントは現在利用できません。管理者にお問い合わせください。
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-end">
          <form action={signOutAction}>
            <Button type="submit" variant="outline">
              Logout
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
