# 技術スタック選定

## 背景

業務システム向けテンプレートでは、技術の先進性よりも、短期実装と継続運用のバランスが重要。  
今回は `Web/PWA 中心`、`少人数開発`、`再利用性重視` を前提に選定する。

## 今回決めること

- テンプレートの標準技術スタック
- 採用しない代替案

## 採用案

- フロントエンド: `Next.js App Router + TypeScript`
- UI: `Tailwind CSS + shadcn/ui`
- バックエンド: `Next.js Route Handlers + Server Actions`
- BaaS: `Supabase`
- ホスティング: `Vercel`
- エラー監視: `Sentry`
- フォーム: `react-hook-form + zod`

## 採用理由

### Next.js

- 管理画面、認証付き画面、サーバー処理を 1 つのアプリで持ちやすい
- App Router 前提で新規に始めやすい

### TypeScript

- 業務ドメインの型を共有しやすく、保守性が高い

### Tailwind CSS + shadcn/ui

- 業務画面の速度とカスタマイズ性のバランスが良い
- UI を丸ごとブラックボックスにせず、自分たちで制御できる

### Supabase

- Auth、DB、Storage、Realtime をまとめて持てる
- PostgreSQL ベースで移行性も確保しやすい

### Vercel

- Next.js との相性が良く、テンプレートの初速を出しやすい

### Sentry

- 案件ごとに最低限の監視基盤を揃えられる

### concrete 前提を採る理由

- 初版で `Core/Profile` 分離まで行うと、未検証の抽象化に時間を使いやすい
- まずは `Supabase / Vercel` 前提で 1 本使えるテンプレートを成立させる方が現実的
- 実案件で複数回使った後に、必要なら共通化の単位を見直せばよい

## 採用しない案とその理由

### GCP フル構成

- 初期段階では重すぎる
- 3 か月前後の業務 MVP テンプレートには過剰

### Firebase

- 認証やホスティングは良いが、業務データの構造化と SQL 運用で Supabase が優位

### Clerk などの認証専用 SaaS

- 良い製品だが、BaaS と分離する分だけテンプレートの判断軸が増える
- まずはシンプルさを優先する

### UI ライブラリ一体型の管理画面テンプレ

- 一見早いが、業務案件に合わせた微調整で結局つらくなりやすい

## 補足方針

- Realtime は「UI 更新通知」として使う
- 正しさの担保は DB 側の制御で行う
- 添付ファイルは初版ではオプション寄りに扱う
- 一覧基盤は初版では通常の table ベースとし、高機能 Data Grid は拡張候補として扱う

## 決定事項

- Data Grid は標準採用せず、通常の table 実装を標準とする
- 高機能一覧が必要な場合のみ、オプション拡張として追加する

## テンプレ本体へ反映すべき項目

- `Next.js`, `TypeScript`, `Tailwind`, `shadcn/ui`, `Supabase`, `Vercel`, `Sentry`
- `react-hook-form`, `zod`
- App Router 前提の構成
- 一覧基盤は通常 table を標準とし、高機能 Data Grid はオプション候補にする
- 初版では `Supabase / Vercel` 前提の concrete 実装で進める
