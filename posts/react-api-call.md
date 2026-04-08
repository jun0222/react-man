---
title: "React でAPIコールする方法まとめ"
date: "2026-04-08"
tags: ["React", "React19", "hooks", "useEffect", "useState", "useMemo", "Suspense", "Promise", "TanStack Query", "use"]
description: "useEffect・use+Suspense（React 19）によるAPIコールの実装パターンと、state管理の落とし穴を解説。"
---

## useEffectでapiコールする場合

※useEffectは副作用に対するhookのため、責務が大きい。SWRや、TanstackQuery、react-useなどライブラリを使って、ユーズケースがapi callだと自明にするのが一般的。

```javascript
import React, { useState, useEffect } from 'react';

const UserList = () => {
  // 1. 状態（State）の定義
  const [users, setUsers] = useState([]);      // データ用
  const [loading, setLoading] = useState(true); // 読み込み中フラグ
  const [error, setError] = useState(null);    // エラー用

  // 2. 初回レンダリング時に実行される処理
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true); // 取得開始時にローディングをON
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }

        const data = await response.json();
        setUsers(data); // Stateに保存
      } catch (err) {
        setError(err.message); // エラーをStateに保存
      } finally {
        setLoading(false); // 成功・失敗に関わらずローディングをOFF
      }
    };

    fetchUsers();
  }, []); // 第2引数を空配列 [] にすることで、初回のみ実行される

  // 3. 画面（View）の出し分け
  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error}</p>;

  return (
    <div>
      <h2>ユーザー一覧</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
```

## useとsuspenseでapiコール周りを実装(react19)

```javascript
import { use, Suspense } from 'react';

// 1. APIを叩く関数（Promiseを返す）
const fetchUsers = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) throw new Error('取得失敗');
  return response.json();
};

// Promiseを定義（コンポーネントの外、またはキャッシュされた場所で管理）
const usersPromise = fetchUsers();

const UserList = () => {
  // 2. use(Promise) でデータを取り出す
  // awaitのように機能するが、データが未完了ならここで描画を「中断」する
  const users = use(usersPromise);

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

// 3. 親コンポーネントで「待機中」と「エラー」をハンドリング
export default function App() {
  return (
    <Suspense fallback={<p>読み込み中（Suspense）...</p>}>
      <UserList />
    </Suspense>
  );
}
```

## オマケ：state管理する必要がないものをstateにしてクリーンアップ必要になった例と、改善

```javascript
// ❌ 悪い例：派生データをStateに入れてしまった場合
const UserProfile = ({ userData }) => {
  // 元データ（userData）から一部をStateにコピー
  const [displayName, setDisplayName] = useState(userData.name);

  // userData（親のデータ）が変わったとき、Stateを手動でリセットしなきゃいけない！
  useEffect(() => {
    setDisplayName(userData.name);
  }, [userData]); // ← これが「余計なリセット処理」

  return (
    <div>
      <input 
        value={displayName} 
        onChange={(e) => setDisplayName(e.target.value)} 
      />
    </div>
  );
};
```


```javascript
// ✅ 良い例：Stateを使わず、計算で出す
const UserStats = ({ apiData }) => {
  // APIレスポンスから「アクティブな項目の合計」を計算したい場合
  // Stateに入れず、レンダリング中に計算する
  const activeCount = useMemo(() => {
    console.log("計算中...");
    return apiData.items.filter(item => item.active).length;
  }, [apiData]); // apiDataが変わった時だけ再計算される

  return (
    <div>
      <p>アクティブ項目数: {activeCount}</p>
    </div>
  );
};
```

※query系の処理（表示のみ）ならstateで管理必要ない可能性が高い、コマンド系の処理ならstateでフロントエンドで状態を保持する必要がある可能性が高い