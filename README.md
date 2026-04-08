# reactman

React + TypeScript + Vite で動くネオブルータリズムテーマのフロントエンド技術ブログ。

## 使い方

### 記事を書く

`/posts/` に `.md` ファイルを置くだけ。ファイル名が URL の slug になる。

```markdown
---
title: "記事タイトル"
date: "2024-04-08"
tags: ["React", "TypeScript"]
description: "記事の概要"
---

本文...
```

### 起動

```bash
npm install
npm run dev
```

### ビルド

```bash
npm run build
```

## 構成

| 機能 | 詳細 |
|---|---|
| ルーティング | `/` 一覧 / `/posts/:slug` 記事 / `/tags` タグ絞り込み |
| Syntax highlight | highlight.js — TS / JS / HTML / CSS / JSX 等に対応 |
| コードブロック | 言語ラベル + Copy ボタン付き |
| テーマ | ネオブルータリズム（太枠・オフセットシャドウ・黄/ピンク/青） |
| フォント | Space Grotesk（本文）+ Space Mono（コード・日付） |
| タグ色 | react/ts → 青、js → オレンジ、css → ピンク、html → オレンジ etc. |

## タグ色の対応

タグ名に応じて自動でバッジの色が変わる。

| タグ | 色 |
|---|---|
| react, typescript, ts, hooks | 青 |
| javascript, js, html, vite | オレンジ |
| css, frontend | ピンク |
| web, performance | 緑 |
| その他 | 黄 |
