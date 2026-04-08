import { Link, useParams, Navigate } from 'react-router-dom'
import { useMemo } from 'react'
import { getPost } from '../utils/posts'
import TagBadge from '../components/TagBadge'
import MarkdownRenderer from '../components/MarkdownRenderer'

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = useMemo(() => getPost(slug ?? ''), [slug])

  if (!post) {
    return <Navigate to="/404" replace />
  }

  return (
    <main className="post-page">
      <header className="post-header">
        <Link to="/" className="post-header__back">
          ← 記事一覧に戻る
        </Link>

        {post.tags.length > 0 && (
          <div className="post-header__tags">
            {post.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        <h1 className="post-header__title">{post.title}</h1>
        <p className="post-header__meta">{post.date}</p>
      </header>

      <MarkdownRenderer content={post.content} />
    </main>
  )
}
