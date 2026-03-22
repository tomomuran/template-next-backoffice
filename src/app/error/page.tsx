import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorPageProps {
  searchParams: Promise<{
    message?: string;
  }>;
}

const messages: Record<string, string> = {
  "auth-confirmation-failed": "招待リンクまたは確認リンクの検証に失敗しました。リンクの有効期限と URL を確認してください。"
};

export default async function ErrorPage({ searchParams }: ErrorPageProps) {
  const params = await searchParams;
  const description =
    (params.message && messages[params.message]) ||
    "処理に失敗しました。環境変数、認証設定、またはリンクの状態を確認してください。";

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-end">
          <Button asChild>
            <Link href="/login">Back to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
