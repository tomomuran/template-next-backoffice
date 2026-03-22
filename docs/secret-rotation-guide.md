# Secret Rotation Guide

## 対象

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_DSN`
- OAuth provider の client secret

## 手順

1. 新しい secret を発行する
2. ローカル、検証、本番の環境変数を更新する
3. 再デプロイする
4. 旧 secret を失効させる
5. `docs/template-adoption.md` に更新日を記録する

## 注意

- `SUPABASE_SERVICE_ROLE_KEY` はクライアントに露出させない
- `NEXT_PUBLIC_` 付き env は公開値のみを置く
