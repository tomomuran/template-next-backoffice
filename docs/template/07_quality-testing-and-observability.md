# 品質、テスト、監視

## 背景

テンプレートは「動く雛形」ではなく「壊れにくい雛形」である必要がある。  
最初から品質の最低ラインを持たないと、案件ごとに劣化していく。

## 今回決めること

- テンプレート標準の品質ゲート
- テストの最低ライン
- 監視の標準

## 採用案

### 品質ゲート

- `typecheck`
- `lint`
- `build`
- `unit test`
- `E2E smoke test`

### 監視

- `Sentry` を標準採用

## 採用理由

- 型、Lint、build は最低限の静的品質担保として必須
- 権限、認証、CRUD の壊れやすい部分を smoke test で守る
- Sentry は案件横断で導入価値が高い
- UI の細かい見た目より、権限、validation、サービス層の正しさを優先して守るべき

## 採用しない案とその理由

### テストなし

- テンプレートの再利用性が落ちる
- 改善が怖くなり、育てにくくなる

### E2E を完全省略

- 認証や権限など、画面遷移を伴う事故を見逃しやすい

### 重い総合試験を標準化

- 初版テンプレとしては運用コストが高い

## 最低限守る対象

- ログイン
- 保護ルート
- `admin` / `member` の権限制御
- CRUD サンプルの作成、編集、削除
- 監査ログ作成

## unit test 方針

- テストランナーは `Vitest`
- unit test は純粋関数、validation、権限判定、service/use-case 層を対象とする
- DB を含むものは unit test に含めない
- React component test は必要最小限に留める
- 外部依存のみ mock し、自前ロジックはなるべく実体で検証する

## integration / E2E 方針

- `tests/integration` と `tests/e2e` を分ける
- Supabase を使う integration と E2E は `Supabase local` 前提にする
- E2E は重くしすぎず、まずは smoke に絞る

## テスト配置

- 実装近接ではなく `tests/` 集約にする
- `tests/unit`
- `tests/integration`
- `tests/e2e`

## CI ルール

- Pull Request 時に typecheck、lint、test、build を実行
- main へのマージ前に CI 成功を必須にする

## エラーハンドリング

- 例外は Sentry へ送る
- ユーザーには一般化したエラーを見せる
- 詳細な内部情報は画面に出さない

## 決定事項

- visual regression は初版標準に含めない
- accessibility test も初版標準に含めない
- どちらも将来の品質強化オプションとして扱う

## テンプレ本体へ反映すべき項目

- typecheck script
- lint script
- test script
- build script
- CI workflow
- Sentry 導入ガイド
- `Vitest`
- `tests/unit`, `tests/integration`, `tests/e2e`
