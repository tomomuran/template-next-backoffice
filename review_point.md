# レビュー記録

## レビュー単発ログ

### 作業: Dependabot アラート解消のための依存更新(2026-10-23)

- レベル: low(既定値。.review-policy.json なし)
- 対象: package.json / pnpm-lock.yaml
  - next と eslint-config-next を 15.5.28 へ
  - @sentry/nextjs を 9 から 10.76.2 へ。9.x のままでは OpenTelemetry と webpack plugin 経由のアラートが消えないため
  - vitest を 3 から 4.1.12 へ。@vitest/mocker の修正版が 4.1.11 以降にしかないため
  - その他の依存を範囲内で一括更新
  - pnpm.overrides で next>postcss を ^8.5.31 に指定
- 担当: 独立Claude(general-purpose サブエージェント) 1回
- 指摘: medium以上 0件。判定は ship
- 検証
  - pnpm typecheck、pnpm lint、pnpm build が成功
  - pnpm test は更新前と同じ 58件成功、2件失敗。失敗は既存のもの
  - pnpm install --frozen-lockfile が pnpm 10.6.5 で成功
  - ログイン画面などのスクリーンショットは、更新前と画素単位で一致
  - pnpm audit は 116件から1件に減った
- 未解決事項(修正見送り): braces 3.0.3(GHSA-vfj7-8cjw-p6xm)
  - 根拠: 修正版がない。経路は eslint-config-next > @next/eslint-plugin-next > fast-glob 3.3.1(版固定) > micromatch。lint 時だけ動き、入力はリポジトリ内のファイルに限られる
  - 再検討の条件: braces か fast-glob の修正版が出たとき
- 既存の問題(報告のみ)
  - instrumentation.ts がないため、サーバーと edge の Sentry が初期化されていない
  - replayIntegration がないためリプレイが動かない
  - 既存の失敗テスト2件のため、CI の static ジョブが build まで進まない
