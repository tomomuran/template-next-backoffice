import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Template Next Backoffice",
  description: "Supabase / Vercel concrete な Next.js 業務システムテンプレート"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ja" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-[family-name:var(--font-inter)] antialiased">
        <AppProviders>
          <div data-app-name={process.env.NEXT_PUBLIC_APP_NAME ?? "Template Next Backoffice"}>{children}</div>
        </AppProviders>
      </body>
    </html>
  );
}
