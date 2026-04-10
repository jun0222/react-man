---
title: "happy-dom とは"
date: "2026-04-10"
tags: ["happy-dom", "jsdom", "test", "jest", "vitest", "バンドルサイズ", "セキュリティ"]
description: "happy-dom の概要と、lodash・Next.js のような大きなライブラリを安易に導入しないほうがよい理由を整理。"
---

## happy-dom

- jsdomみたいにテストの実行に必要な依存関係として使える
- lodashとか、Next.jsとか高機能なユーティリティを入れるのってどうなの？という点が解消されそう
- どうなの？
  - 有名&&意図しなかったり理解していない機能が多くなるゆえ攻撃者に狙われやすい
  - 単純にバンドルサイズ重くなる
  - そもそも不要なものがなくシンプルな方がパフォーマンスも開発も速い
- スター数も4.4kある。

## 参考記事

### 公式GitHub

https://github.com/capricorn86/happy-dom

### Zenn

https://zenn.dev/lecto/articles/052528b20144da