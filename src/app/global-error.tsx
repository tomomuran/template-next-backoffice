"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="ja">
      <body className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-6 py-12 font-sans text-[#0f172a] antialiased">
        <div className="w-full max-w-md space-y-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">予期しないエラーが発生しました</h1>
          <p className="text-sm text-[#475569]">
            アプリケーションで問題が発生しました。再読み込みするか、しばらくしてからもう一度お試しください。
          </p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-10 items-center rounded-md bg-[#0f172a] px-4 text-sm font-medium text-white transition-colors hover:opacity-90"
            >
              再読み込み
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
