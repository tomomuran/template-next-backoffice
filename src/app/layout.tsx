import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Template Next Backoffice",
  description: "Supabase / Vercel concrete な Next.js 業務システムテンプレート"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <AppProviders>
          <div data-app-name={process.env.NEXT_PUBLIC_APP_NAME ?? "Template Next Backoffice"}>{children}</div>
        </AppProviders>
      </body>
    </html>
  );
}
