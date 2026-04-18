"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>エラーが発生しました</CardTitle>
          <CardDescription>
            ページの表示中に問題が発生しました。再試行するか、ダッシュボードに戻ってください。
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-end gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button type="button" onClick={reset}>
            再試行
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
