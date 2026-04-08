import { useMemo } from 'react'
import PostCard from '../components/PostCard'
import { getAllMeta } from '../utils/posts'

export default function Home() {
  const posts = useMemo(() => getAllMeta(), [])

  return (
    <>
      <section className="hero">
        <div className="hero__inner">
          <p className="hero__tag">Tech Blog</p>
          <h1 className="hero__title">
            Everything<br />
            <em>Frontend.</em>
          </h1>
          <p className="hero__desc">
            React、TypeScript、JavaScript、CSS、HTML — Web 標準やモダンフロントエンド。
          </p>
        </div>
      </section>

      <main className="posts-section">
        <h2 className="section-title">最新記事 — {posts.length}</h2>
        <div className="posts-grid">
          {posts.length === 0 ? (
            <div className="posts-empty">
              <p>// まだ記事がありません。/posts に .md ファイルを置いてください。</p>
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.slug} post={post} />)
          )}
        </div>
      </main>
    </>
  )
}
