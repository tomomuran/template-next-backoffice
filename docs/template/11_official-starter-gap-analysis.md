# 公式 starter との差分整理

## 目的

現在の骨格が、`Vercel` と `Supabase` の公式 starter / 公式導線のどこまでを取り込み、どこが未反映かを整理する。  
この文書は「公式 starter を丸ごと入れているか」を判定するものではなく、`template-next-backoffice` に取り込む価値がある要素を洗い出すための比較メモである。

確認日は `2026-03-20`。  
参照元は以下の公式ページ。

- Vercel Admin Dashboard Template
  - https://vercel.com/templates/next.js/admin-dashboard
- Supabase Next.js SSR / tutorial
  - https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs
  - https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs

## 結論

現状の骨格は、`Supabase / Vercel` 前提の concrete template ではあるが、`Vercel Admin Dashboard` や `Supabase` の公式 starter を丸ごとベースにしたものではない。  
公式 starter のうち、`業務システムの土台として必要な部分だけ` を再構成している。

そのため、評価は次の通り。

- 既に十分取り込めているもの
  - Next.js App Router
  - TypeScript
  - Tailwind CSS
  - `shadcn/ui` 相当の UI 基盤
  - `Supabase SSR` の server utility
  - 認証付き画面、Server Actions、CRUD サンプル
  - `account/profile` の最小画面
- 意図的に外しているもの
  - Auth.js
  - Postgres 直結の Vercel starter 構成
  - SaaS / dashboard 向けの products サンプル
  - 添付ファイル、アバター、profile 管理画面
- 追加した方がよいもの
  - `Vercel Analytics` と `Sentry` の導線整理

## Vercel Admin Dashboard との比較

Vercel の Admin Dashboard template は、公式ページ上で次の構成を明示している。

- Next.js App Router
- TypeScript
- Auth.js
- Postgres
- Vercel
- Tailwind CSS
- Shadcn UI
- Vercel Analytics
- Prettier

参考:
- `Admin Dashboard` overview に上記 stack の記載あり
- ページでは `products` テーブル作成と `app/api/seed.ts` による seed を案内している

### 既に反映できている要素

- App Router
- TypeScript
- Tailwind CSS
- `Prettier`
- `shadcn/ui` 風の共通 UI
- dashboard レイアウト
- sample CRUD
- `.env.example`
- `pnpm` 前提の起動導線

### 反映していない要素

- `Auth.js`
- `Postgres` 直結構成
- `Vercel Analytics`
- `app/api/seed.ts` ベースの seed ルート
- products サンプル

### 反映していない理由

- 認証は `Supabase Auth` に寄せる方針のため、`Auth.js` は採用しない
- DB は `Supabase local + migration + seed.sql` を正とするため、Vercel Postgres の seed route は不要
- products サンプルより `contacts` の方が業務テンプレとして再利用性が高い

### Vercel starter から追加した方がよいもの

1. `Vercel Analytics`
- 現状は optional integration として導線だけ入っている
- `Analytics` は optional にしてもよいが、Vercel へ載せる前提なら導線だけ入れておく価値がある

## Supabase 公式 Next.js 導線との比較

Supabase の SSR docs と tutorial は、Next.js 向けに次を案内している。

- `@supabase/ssr` と `@supabase/supabase-js`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/proxy.ts`
- `login` ページ
- `auth/confirm` route
- `account` ページ
- email / password 認証

公式 docs のポイント:

- browser 用と server 用の 2 種類の Supabase client を作る
- `Proxy` で cookie refresh を扱う
- SSR 環境では `token_hash` を受ける `auth/confirm` endpoint を用意する

### 既に反映できている要素

- `@supabase/ssr` と `@supabase/supabase-js`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/proxy.ts`
- 認証付き `login` ページ
- `src/app/auth/confirm/route.ts`
- `src/app/(app)/account/page.tsx`
- `forgot password` / `update password` 導線
- `Server Actions` からの sign in / sign out
- `Supabase local`
- migration / seed / reset

### 未反映の要素

1. 招待送信 UI
- 招待制の方針はあるが、管理者がユーザーへ invite を送る UI はまだない
- Supabase Auth 管理 API を使う導線は今後の追加対象

### 優先して追加した方がよいもの

1. `Vercel Analytics`
- Vercel 前提運用なら導線だけでも足す価値がある

2. 招待送信 UI
- 招待制をテンプレ標準にするなら、管理者向け invite 画面は次の候補になる

## 今の骨格に対する評価

### 良い点

- 業務システム向けに不要な SaaS starter 要素をかなり落とせている
- `Supabase local`, migration, seed, tests, docs 運用まで最初から持っている
- `contacts` をサンプルにしたことで業務テンプレとしての再利用性が高い

### 弱い点

- `Supabase` 公式導線との整合は改善したが、招待送信 UI はまだ未実装
- `Vercel` 系では `Analytics`, 実際の Vercel 接続設定がまだない
- `Sentry` は初期化ファイルを追加したが、実運用の設定確認は未実施

## 追加判断

### 後回しでよい

- `Vercel Analytics`
- avatar / storage upload

### 採用しない

- `Auth.js`
- Vercel starter の products / seed API そのまま
- Vercel Postgres 前提の DB 構成

## 次アクション

1. `Sentry` と `Vercel Analytics` の実動確認を行う
2. 管理者向けの招待送信 UI を追加するか判断する
