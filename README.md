# template-next-backoffice

業務システムを素早く立ち上げるためのNext.jsテンプレート。
認証、ロールベースアクセス制御、監査ログ、CRUDサンプルを含み、案件ごとに土台として使い回せる設計になっています。

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フレームワーク | Next.js 15 (App Router) / React 19 |
| 言語 | TypeScript 5 |
| 認証/DB | Supabase (Auth, PostgreSQL, RLS) |
| スタイル | Tailwind CSS 4 |
| フォーム | React Hook Form + Zod |
| テスト | Vitest (unit/integration) + Playwright (E2E) |
| 監視 | Sentry, Vercel Analytics (opt-in) |
| ホスティング | Vercel |

## 機能一覧

- **認証**: メール/パスワード認証、パスワードリセット、招待フロー
- **RBAC**: admin / memberの2ロール制御、Middleware + RLSの二重防御
- **ユーザー管理**: 招待、ロール変更、アカウント停止 (admin専用)
- **監査ログ**: 操作履歴の自動記録と閲覧画面 (admin専用)
- **CRUD サンプル**: contactsモデルによるフォーム、バリデーション、テーブル表示の実装例
- **ダッシュボード**: Rechartsによるグラフ表示 (KPI、折れ線、棒、ドーナツ、ランキング)
- **カンバン**: ドラッグ&ドロップ対応のボード表示
- **カレンダー**: Schedule-Xによるイベント表示
- **エラーハンドリング**: Error Boundary、404、グローバルエラー、ローディング状態

## アーキテクチャ

```
src/
  app/              # Next.js App Router (ルーティング、レイアウト)
    (app)/           # 認証必須エリア
    auth/            # 認証関連ルート
    login/           # ログイン画面
  features/          # 機能単位のモジュール (components, services, actions)
    auth/
    contacts/        # CRUDサンプル
    users/           # ユーザー管理
    audit-logs/
    profile/
  components/        # 共通UIコンポーネント
  lib/               # ユーティリティ、Supabaseクライアント、環境変数スキーマ
supabase/
  migrations/        # DBマイグレーション
  seed.sql           # ローカル開発用シードデータ
tests/
  unit/              # スキーマバリデーション等の単体テスト
  integration/       # RLS、RBAC、Middlewareの統合テスト
  e2e/               # Playwrightによるブラウザテスト
```

features配下は機能ごとに`components/`、`services/`、`actions.ts`(Server Actions)をまとめており、案件固有の機能を追加する際はこの構造に倣います。

## セットアップ

**前提**: Node.js 22, Docker互換ランタイム (Docker Desktop or OrbStack), Supabase CLI

```bash
corepack enable
corepack prepare pnpm@10.6.5 --activate
pnpm install
pnpm bootstrap   # .env生成 + Supabase起動 + DB初期化
pnpm dev          # http://127.0.0.1:3300
```

### ローカル確認用アカウント

`pnpm db:reset` 後に利用可能:

| メールアドレス | パスワード | ロール |
|---|---|---|
| admin@example.com | ChangeMe123! | admin |
| member@example.com | ChangeMe123! | member |

## 主要コマンド

| コマンド | 内容 |
|---|---|
| `pnpm dev` | 開発サーバー起動 |
| `pnpm build` | プロダクションビルド |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript型チェック |
| `pnpm test` | Vitestによるunit/integrationテスト |
| `pnpm test:e2e` | Playwright E2Eテスト (Supabase自動起動) |
| `pnpm bootstrap` | 初回セットアップ |
| `pnpm db:reset` | DB初期化 + シード投入 |
| `pnpm db:check` | マイグレーション整合性チェック |

## テンプレートとしての使い方

このテンプレートは完成品ではなく、案件開始時にforkして独自機能を追加していく土台です。

**対象**: 社内業務システム、管理画面中心の中小規模アプリ、3か月前後でMVPを立ち上げたい案件

**非対象**: 公開SaaS (課金が必要)、ネイティブアプリ前提、大企業向け厳格統制

詳細なドキュメント:

- [テンプレート設計書](./docs/template/template_master_plan.md)
- [導入手順](./docs/adoption-guide.md)
- [既存案件への横展開](./docs/upgrade-playbook.md)

## Optional Integrations

- `NEXT_PUBLIC_SENTRY_DSN` / `SENTRY_DSN` を設定するとSentryが有効になります
- `NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED=true` でVercel Analyticsを有効化できます

## License

Private
