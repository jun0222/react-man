---
title: "React.dispatch とは"
date: "2026-04-10"
tags: ["React", "TypeScript", "dispatch", "useReducer", "useState", "SetStateAction"]
description: "React.dispatch は setState のように値をコミット・送信する処理。useReducer や Context でよく登場する型の読み方を整理。"
---

## React.dispatch とは

`setState` のように、状態の更新をコミット（送信）するための関数。

`useReducer` や `Context` でよく登場する。

## よくある型の書き方

```typescript
React.dispatch<React.SetStateAction<{ id: number; name: string }>>
```

`React.SetStateAction<T>` は `T` か `(prev: T) => T` のどちらかを受け取る型。

```typescript
// どちらも有効
dispatch({ id: 1, name: "Alice" })
dispatch((prev) => ({ ...prev, name: "Bob" }))
```

## useReducer との関係

```typescript
const [state, dispatch] = useReducer(reducer, initialState)
// dispatch の型は React.Dispatch<Action>
```

`useState` の場合は `React.Dispatch<React.SetStateAction<T>>` が setter の型になる。

## 参考

https://react.dev/reference/react/useReducer