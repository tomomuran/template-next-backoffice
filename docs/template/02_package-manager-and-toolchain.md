# パッケージマネージャとツールチェーン

## 背景

複数案件で継続運用するテンプレートでは、`npm` と `pnpm` が混在すると再現性が崩れやすい。  
同様に Node バージョンの揺れも、CI やローカルセットアップの不具合原因になる。

## 今回決めること

- パッケージマネージャ
- バージョン固定方法
- ローカルと CI の共通ルール

## 選択肢

### A. `npm`

- Node 同梱で導入障壁が低い
- 標準寄りで説明しやすい

### B. `pnpm`

- 依存解決が速く、workspace に強い
- lockfile の扱いが安定しやすい

### C. 案件ごとに任せる

- その場では柔軟だが、運用は崩れやすい

## 採用案

`B. pnpm`

## 採用理由

- 社内テンプレートとして継続運用する時に再現性を取りやすい
- 将来的な workspace 化や共通 package 切り出しに強い
- 案件横断で install/CI 体験を揃えやすい

## 採用しない案とその理由

### A. `npm` を採らない理由

- 使えないわけではないが、複数案件を横断した時の運用メリットは `pnpm` が上回る

### C. 案件ごとに任せない理由

- `npm` と `pnpm` の混在は最も避けるべき状態
- lockfile 競合やドキュメント齟齬の原因になる

## 採用ルール

- `package.json` に `packageManager` を必ず書く
- lockfile は `pnpm-lock.yaml` のみを正とする
- `package-lock.json` は生成しない
- CI は `pnpm install --frozen-lockfile` を使う
- ローカルでも `npm install` を禁止する

## 実装ルール

### Node

- `.nvmrc` を持つ
- CI の Node バージョンと一致させる
- `Node LTS` を前提にする

### pnpm

- `corepack` 経由で利用する
- テンプレート初版の検証済み版を `packageManager` に記載する

例:

```json
{
  "packageManager": "pnpm@10.6.5"
}
```

### install ガード

- `preinstall` に `only-allow pnpm` を入れる

例:

```json
{
  "scripts": {
    "preinstall": "npx only-allow pnpm"
  }
}
```

## CI ルール

- install は `pnpm install --frozen-lockfile`
- build、lint、typecheck、test を `pnpm` で実行
- `npm install` や `npm ci` は CI に置かない

## 決定事項

- Node の固定方法は `.nvmrc` に統一する

## テンプレ本体へ反映すべき項目

- `packageManager`
- `pnpm-lock.yaml`
- `preinstall`
- Node バージョン固定ファイル
- README の初回セットアップ手順
- Node バージョン固定ファイルは `.nvmrc` を採用する
