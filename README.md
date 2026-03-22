# template-next-backoffice

社内向け業務システムの共通土台です。  
初版は `Supabase / Vercel` concrete 前提で、認証、権限、監査ログ、`contacts` CRUD サンプル、`Supabase local` 運用の骨格を含みます。

## 前提

- Node.js `22`
- `corepack enable`
- `pnpm@10.6.5`
- Supabase CLI

## セットアップ

```bash
corepack enable
corepack prepare pnpm@10.6.5 --activate
pnpm install
pnpm bootstrap
pnpm dev
```

ローカル検証では Docker 互換ランタイムが必要です。`Docker Desktop` を標準とし、個人環境では `OrbStack` でも動作します。

## ローカル確認用アカウント

`pnpm db:reset` 後は次のアカウントでログインできます。

- `admin@example.com` / `ChangeMe123!`
- `member@example.com` / `ChangeMe123!`

## 主要コマンド

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm bootstrap
pnpm db:reset
pnpm db:check
```

## 認証導線

- `/login`
- `/auth/forgot-password`
- `/auth/update-password`
- `/auth/confirm`

## Optional Integrations

- `NEXT_PUBLIC_SENTRY_DSN` と `SENTRY_DSN` を設定すると `Sentry` 初期化ファイルが有効になります
- `NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED=true` で `Vercel Analytics` を有効化できます
- `/account` に最小の profile 管理画面があります

## テンプレ運用

- ベース仕様: [docs/template/template_master_plan.md](./docs/template/template_master_plan.md)
- 導入手順: [docs/adoption-guide.md](./docs/adoption-guide.md)
- 既存案件への横展開: [docs/upgrade-playbook.md](./docs/upgrade-playbook.md)
- 案件側の採用差分: [docs/template-adoption.md](./docs/template-adoption.md)
- 案件側のフィードバック: [docs/template-feedback.md](./docs/template-feedback.md)
