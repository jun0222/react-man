import { useMemo, useState } from 'react'
import { getAllMeta } from '../utils/posts'
import PostCard from '../components/PostCard'

export default function TagsPage() {
  const posts = useMemo(() => getAllMeta(), [])
  const [active, setActive] = useState<string | null>(null)

  const tags = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const post of posts) {
      for (const tag of post.tags) {
        counts[tag] = (counts[tag] ?? 0) + 1
      }
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [posts])

  const filtered = useMemo(
    () => (active ? posts.filter((p) => p.tags.includes(active)) : posts),
    [posts, active]
  )

  return (
    <main className="tags-page">
      <h1 className="section-title">タグで絞り込む</h1>

      <div className="tags-cloud">
        <button
          className={`tag-btn${active === null ? ' active' : ''}`}
          onClick={() => setActive(null)}
        >
          すべて ({posts.length})
        </button>
        {tags.map(([tag, count]) => (
          <button
            key={tag}
            className={`tag-btn${active === tag ? ' active' : ''}`}
            onClick={() => setActive(active === tag ? null : tag)}
          >
            {tag} ({count})
          </button>
        ))}
      </div>

      <div className="posts-grid">
        {filtered.length === 0 ? (
          <div className="posts-empty">
            <p>// このタグの記事はまだありません。</p>
          </div>
        ) : (
          filtered.map((post) => <PostCard key={post.slug} post={post} />)
        )}
      </div>
    </main>
  )
}
