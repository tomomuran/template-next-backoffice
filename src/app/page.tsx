import Link from "next/link";
import { ArrowRight, Database, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { primarySampleFeature } from "@/lib/sample-features";

const cards = [
  {
    title: "Auth / RBAC",
    description: "招待制のメール + パスワード、admin/member、監査ログの前提を含みます。",
    icon: ShieldCheck
  },
  {
    title: primarySampleFeature.homeTitle,
    description: primarySampleFeature.homeDescription,
    icon: Users
  },
  {
    title: "Supabase Local",
    description: "migration、seed、reset script、migration check を標準で持ちます。",
    icon: Database
  }
];

export default function HomePage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-12">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <section className="space-y-6">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-500">template-next-backoffice</p>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              社内向け Next.js 業務システムを繰り返し作るための concrete template
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              初版は Supabase / Vercel 前提です。認証、権限、監査ログ、{primarySampleFeature.key} サンプル、Supabase local を骨格として揃えています。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/login">
                Sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </section>
        <Card>
          <CardHeader>
            <CardTitle>初回セットアップ</CardTitle>
            <CardDescription>README と docs を見ながら、最小の骨格を立ち上げる流れです。</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm text-slate-700">
              <li>1. `corepack enable`</li>
              <li>2. `pnpm install`</li>
              <li>3. `cp .env.example .env.local`</li>
              <li>4. `pnpm db:reset`</li>
              <li>5. `pnpm dev`</li>
            </ol>
          </CardContent>
        </Card>
      </div>

      <section className="mt-12 grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="pt-4">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
