# Adoption Guide

## 1. 新規案件開始時

1. GitHub Template から新しい repo を生成する
2. `README.md` に `Based on template-next-backoffice vX.Y.Z` を記載する
3. `pnpm bootstrap` を実行し、`.env.local` と `docs/template-adoption.md` を初期化する
4. `docs/template-adoption.md` に案件固有の差分を書く
5. `contacts` サンプル feature を確認し、不要な項目を削る

## 2. 初回確認

1. `pnpm install`
2. `pnpm bootstrap`
3. `pnpm dev`
4. ログイン、ダッシュボード、contacts 一覧の表示を確認する

## 3. 案件固有の追加

- 認証 provider の有効化
- ドメインモデルの追加
- 権限差分の調整
- CI と Sentry の本番接続
