# 既存プロジェクトからの取り込みマップ

## 目的

既存プロジェクトにある実装や構成のうち、`template-next-backoffice` 初版へ取り込む候補を整理する。  
この文書は「どこから、何を、どう持ってくるか」を実装担当が迷わず判断できるようにするためのマップであり、単なる参考リンク集ではない。

## 判定ルール

- `取り込む`
  初版テンプレートへ直接持ち込む候補
- `参考にする`
  考え方や一部実装は使うが、そのままは入れない候補
- `捨てる`
  今回のテンプレートには持ち込まない候補

## 取り込み優先順位

1. `again`
   認証、Supabase local、E2E、バックオフィス寄り構成
2. `suuji-ai`
   `contacts` サンプル feature、Supabase helper、migration の書き方
3. `botto-beta-lp`
   UI レイアウト、shadcn/ui 周辺部品、provider 構成
4. `portfolio-2025`, `comono-site`
   今回は対象外

## 取り込む

| 参照元 | テンプレ側の想定配置 | 取り込み方針 | 理由 |
|---|---|---|---|
| `again/lib/supabase/server.ts` | `src/lib/supabase/server.ts` | ベースとして取り込む | `@supabase/ssr` を使ったサーバークライアント生成の形がそのまま使える |
| `again/lib/supabase/middleware.ts` | `src/lib/supabase/middleware.ts` | ベースとして取り込む | middleware でのセッション更新と cookie 反映の基盤になる |
| `again/supabase/config.toml` | `supabase/config.toml` | ベースとして取り込んで調整する | `Supabase local`, seed, studio, inbucket を含み、初版テンプレの方針と相性が良い |
| `again/e2e/support.ts` | `tests/e2e/support.ts` | 構造を維持して取り込む | Playwright の共通支援関数の置き場として良い |
| `suuji-ai/src/lib/supabase/server.ts` | `src/lib/supabase/server.ts` の一部 | `getServiceRoleSupabase` と env 取得方針を取り込む | service role client と env エラー化の考え方が有用 |
| `suuji-ai/supabase/migrations/20251105000000_init.sql` の `contacts` 定義 | `supabase/migrations/0001_contacts.sql` 相当 | `contacts` の項目設計のたたき台として取り込む | 初版サンプル feature が `contacts` のため |
| `botto-beta-lp/src/components/ui/sidebar.tsx` | `src/components/ui/sidebar.tsx` | ベースとして取り込んで整理する | PC/モバイル両対応のサイドバー基盤として使える |
| `botto-beta-lp/src/components/providers/app-providers.tsx` | `src/components/providers/app-providers.tsx` | `TooltipProvider` と `Toaster` 部分を取り込む | テンプレ共通 provider の土台になる |
| `botto-beta-lp/src/lib/utils.ts` | `src/lib/utils.ts` | そのまま取り込む | `cn` は共通ユーティリティとして必須 |

## 参考にする

| 参照元 | テンプレ側の想定配置 | 参考方針 | 注意点 |
|---|---|---|---|
| `again/lib/auth/roles.ts` | `src/lib/auth/roles.ts` | ロール判定をサーバー側で行う方針だけ参考にする | `OPERATOR`, `STORE_ADMIN`, `store_id` などが業務固有 |
| `again/lib/validation/public.ts` | `src/features/contacts/services/schemas.ts` など | `zod` schema の分離方針を参考にする | schema 名や項目は業務固有なので作り直す |
| `suuji-ai/src/lib/supabase/server.ts` の `requireUser` | `src/lib/auth/require-user.ts` | 認証必須ユーティリティの考え方を参考にする | 現状の cookie デバッグログはテンプレに不要 |
| `suuji-ai/supabase/migrations/20251105000000_init.sql` の RLS | `supabase/migrations/*` | RLS の書き方を参考にする | `auth.uid() = user_id` の所有モデルは今回のバックオフィスとは異なる |
| `botto-beta-lp/src/lib/queryClient.ts` | 将来の `src/lib/http` | API エラー処理の考え方だけ参考にする | 初版テンプレは `Server Actions` 主体で、React Query は必須ではない |
| `again/components.json` | `components.json` | `shadcn/ui` 設定値を参考にする | テンプレでは新規に `rsc`, `css`, alias を整える |
| `botto-beta-lp/components.json` | `components.json` | `shadcn/ui` 設定値を参考にする | `rsc: false` なので、そのままは使わない |

## 捨てる

| 参照元 | 理由 |
|---|---|
| `botto-beta-lp/src/lib/server/db.ts` | `Drizzle + postgres` 前提で、今回の `Supabase concrete` テンプレとは別路線 |
| `botto-beta-lp/src/lib/server/auth.ts` | Basic 認証であり、今回の招待制認証とは無関係 |
| `portfolio-2025` の page / UI 実装 | 公開サイト寄りで、業務テンプレの認証、権限、監査、CRUD に直結しない |
| `comono-site` の CMS 連携 | `microCMS` 前提であり、今回のバックオフィステンプレとは責務が異なる |
| `suuji-ai` の `imports`, `mail_jobs`, `unsubscribes` スキーマ | `contacts` サンプル featureとしては過剰で、テンプレ初版の責務を超える |

## テンプレ側の想定配置

初版テンプレでは、取り込み先の主要配置を以下で固定する。

- `src/lib/supabase/server.ts`
- `src/lib/supabase/middleware.ts`
- `src/lib/supabase/service-role.ts`
- `src/lib/auth/roles.ts`
- `src/lib/utils.ts`
- `src/components/providers/app-providers.tsx`
- `src/components/ui/sidebar.tsx`
- `src/features/contacts/...`
- `supabase/config.toml`
- `supabase/migrations/...`
- `tests/e2e/support.ts`

## 実装時の注意

- 参照元のコードをそのままコピーしない
- 業務固有ロール、業務固有スキーマ、命名はテンプレ向けに縮約する
- `again` の優先度は高いが、`store` や `customer` に依存する要素は除去する
- `suuji-ai` の `contacts` は項目設計の参照元として使い、RLS や所有モデルは作り直す
- `botto-beta-lp` の UI 部品は、依存する hook や provider を含めて整合確認する

## 初版で実際に持ち込む順番

1. `again` から `Supabase SSR helper` と `config.toml`
2. `suuji-ai` から `contacts` の項目設計
3. `botto-beta-lp` から `sidebar`, `providers`, `cn`
4. それらをテンプレ構成に合わせて `admin/member`, `招待制`, `contacts sample` に再設計する
