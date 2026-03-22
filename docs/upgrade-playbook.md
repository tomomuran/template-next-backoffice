# Upgrade Playbook

## 方針

- テンプレ更新は既存案件へ自動同期しない
- 必要な修正だけを案件へ手動移植する
- 優先対象はセキュリティ、認証、監査ログ、migration 不備の修正

## 手順

1. テンプレの `CHANGELOG.md` を確認する
2. 対象案件で必要な差分だけを抽出する
3. 差分を手動移植する
4. `pnpm bootstrap` でローカル前提を揃えたうえで `pnpm typecheck`, `pnpm test`, `pnpm build` を通す
5. `docs/template-adoption.md` に反映内容を追記する
