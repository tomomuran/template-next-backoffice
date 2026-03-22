# DB マイグレーションと環境変数

## 背景

テンプレートは、ローカルでは動くが本番で崩れる、という状態を避ける必要がある。  
そのためには DB 変更と環境変数の扱いを標準化しておく必要がある。

## 今回決めること

- migration 運用
- seed 運用
- 環境変数設計

## 採用案

### migration

- `Supabase migration` を正式な変更履歴とする
- 手動 SQL 修正だけで状態を進めない
- CI で `migration check` を行う

### seed

- 開発用 seed を持つ
- 最低限、管理者ユーザーとサンプル業務データを投入できるようにする
- ローカル DB を migration + seed で再構築する `reset script` を標準搭載する

### env

- `.env.example` を持つ
- 必須 env は起動時に検証する
- env schema は `zod` で定義する
- `secret rotation guide` を標準ドキュメントとして持つ

## 採用理由

- DB 変更履歴が残ると、案件間での再現性が高い
- seed があると、新規案件の立ち上がりが速い
- env schema があると設定漏れを早期発見できる
- `reset script` があると、再現、オンボーディング、調査が大幅に楽になる
- `migration check` があると、ローカルだけで進んだ変更を検出しやすい
- `secret rotation guide` があると、長期運用のときに属人化しにくい

## 採用しない案とその理由

### DB を手作業で育てる

- 最も事故が多い
- テンプレート価値を壊す

### `.env` の説明だけ README に書く

- 漏れやすく、実行時エラーになりやすい

## 環境変数ルール

- サーバー専用 env と公開 env を分ける
- `NEXT_PUBLIC_` は必要最低限
- 秘密情報は絶対に公開 env に入れない

## ローカル/検証/本番ルール

- ローカル: `Supabase local` と seed を使う
- 検証: 可能なら本番相当の構成で確認
- 本番: 手動 SQL を禁止し、migration ベースで反映

## 標準運用スクリプトと文書

- `reset script`
- `migration check`
- `secret rotation guide`

## オプション候補

- staging seed
- anonymized sample data
- RLS test helper
- env preset files
- preview environment bootstrap
- schema docs generation

## 決定事項

- ローカル開発と自動テストの基盤は `Supabase local` を標準とする
- クラウド Supabase は検証環境と本番環境で利用する

## テンプレ本体へ反映すべき項目

- migration ディレクトリ
- seed 実行手順
- `.env.example`
- env schema
- `reset script`
- `migration check`
- `secret rotation guide`
