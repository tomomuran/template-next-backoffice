# Next.js 業務システムテンプレート統合プラン

## 1. 目的

`template-next-backoffice` を、社内向け業務システムの共通土台として整備する。  
対象は、認証付きの管理画面、業務 CRUD、スマホ現場入力、CSV 運用を含む MVP 案件。  
SaaS 課金や公開マーケティング機能は対象外。

初版では `Core / Profile` 分離のような抽象化は行わず、`Supabase / Vercel` 前提の concrete なテンプレートとして実装する。

## 2. 採用技術

- アプリ: `Next.js App Router + TypeScript`
- UI: `Tailwind CSS + shadcn/ui`
- フォーム: `react-hook-form + zod`
- BaaS: `Supabase`
- ホスティング: `Vercel`
- 監視: `Sentry`
- パッケージマネージャ: `pnpm`

## 3. 配布と更新

- 配布方式は `GitHub Template Repository`
- テンプレート自体に `SemVer` を適用する
- 初回リリースは `v0.1.0` から開始する
- `CHANGELOG.md` と `TEMPLATE_VERSION` を持つ
- 既存案件へ自動同期しない
- 既存案件へは必要な修正だけを手動移植する

## 4. ツールチェーン固定

- `package.json` に `packageManager` を明記する
- `pnpm-lock.yaml` を唯一の lockfile とする
- `package-lock.json` は生成しない
- `preinstall` に `only-allow pnpm` を入れる
- Node は LTS を固定し、ローカルと CI で揃える
- Node の固定は `.nvmrc` に統一する
- install は `pnpm install --frozen-lockfile`

## 5. 認証、権限、監査

- 標準認証は `Supabase Auth` の `招待制メール + パスワード`
- `self-signup` は提供しない
- 権限は初版で `admin` / `member`
- 認可はサーバー側で実施する
- 監査ログを標準搭載し、作成、更新、削除、状態変更を記録する
- 2 段階認証は初版標準に含めない
- `Google OAuth` と `Microsoft OAuth` はオプション拡張とする
- OAuth provider の設定は env 中心で行う

監査ログ標準項目:

- actor
- action
- target_type
- target_id
- before
- after
- occurred_at

## 6. データモデルとバックエンド

主要テーブルの共通カラム:

- `id`
- `created_at`
- `updated_at`
- `created_by`
- `updated_by`
- `deleted_at`
- `deleted_by`

運用ルール:

- 初版の削除は `soft delete`
- `is_deleted` は持たず、削除判定は `deleted_at` で行う
- 入力検証は `zod`
- UI からの主要操作は `Server Actions`
- 外部連携や API 契約が必要なものは `Route Handlers`
- DB 書き込みと監査ログ記録はサービス層に集約する
- サービス層の命名規則は `services` に統一する

## 7. UI/UX 標準

- レイアウトは左サイドバー + 上部ヘッダー
- モバイルではドロワー化
- CRUD は `一覧 / 詳細 / 作成 / 編集` を標準とする
- 一覧基盤は通常の table を標準とし、高機能 Data Grid はオプション拡張とする
- 通常 table ベースの DataTable コンポーネントを共通基盤として持つ

テーブル標準機能:

- 検索
- ソート
- フィルタ
- ページング
- 空状態表示
- CSV 出力

フォーム標準機能:

- 必須表示
- バリデーション
- 送信中状態
- エラー表示
- 未保存変更警告

UI のオプション候補:

- advanced data grid
- 一括編集
- 一括削除
- CSV import
- カラム表示切り替え
- インライン編集
- アーカイブ一覧
- コメント/メモ
- 添付ファイル UI

## 8. 品質と監視

テンプレート標準の品質ゲート:

- `typecheck`
- `lint`
- `build`
- `unit test`
- `E2E smoke test`

最低限守るシナリオ:

- ログイン
- 保護ルート
- `admin` / `member` の権限制御
- CRUD サンプルの作成、編集、削除
- 監査ログ作成

監視:

- `Sentry` を標準導入する

テスト方針:

- unit test は `Vitest`
- 配置は `tests/unit`, `tests/integration`, `tests/e2e`
- integration と E2E は `Supabase local` 前提
- React component test は必要最小限
- visual regression と accessibility test は初版標準に含めない

## 9. DB 運用と env

- DB 変更は `Supabase migration` を正とする
- CI で `migration check` を実行する
- 開発用 seed を持つ
- `reset script` を標準搭載する
- `.env.example` を置く
- 必須 env は `zod` schema で検証する
- `NEXT_PUBLIC_` は必要最低限に制限する
- `secret rotation guide` を標準ドキュメントとして持つ
- ローカル開発と自動テストは `Supabase local` を標準とする

## 10. 導入手順

1. GitHub Template から新 repo を作成
2. README にベーステンプレート版を記録
3. Supabase project と環境変数を設定
4. `docs/template-adoption.md` を作成する
5. サンプル feature を確認
6. 案件固有ドメインを追加
7. CI とデプロイ設定を接続

## 11. テンプレートへ戻す基準

- 2 案件以上で再利用価値が確認できたものだけ戻す
- 案件固有コードは戻さない
- テンプレートへ戻す時は抽象化してから戻す

案件側の運用:

- 各案件 repo に `docs/template-adoption.md` を置く
- 各案件 repo に `docs/template-feedback.md` を置く
- 還元候補は案件 repo で一次記録し、GitHub Issue / Project で中央集約する
- 還元レビューは file 単位ではなく、feature 単位または基盤単位で行う

## 12. 初版で用意するもの

- 認証画面
- `admin` / `member` の権限制御
- 監査ログ基盤
- `contacts` の CRUD サンプル feature 1 本
- テーブル基盤
- フォーム基盤
- migration と seed
- CI
- Sentry 導入導線
- `docs/adoption-guide.md`
- `docs/upgrade-playbook.md`
- `docs/template-adoption.md` の雛形
- `docs/template-feedback.md` の雛形
- `docs/template/10_import-map.md`
- `docs/template/11_official-starter-gap-analysis.md`

初版標準から外すもの:

- 添付ファイル機能

## 13. 次の実装単位

1. テンプレ repo の初期化
2. `pnpm` と Node の固定
3. Next.js / Supabase / shadcn/ui の導入
4. 認証、権限、監査ログの土台実装
5. CRUD サンプル feature 実装
6. CI、テスト、Sentry 追加
