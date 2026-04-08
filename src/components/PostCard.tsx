import { useNavigate } from 'react-router-dom'
import type { PostMeta } from '../types/post'
import TagBadge from './TagBadge'

interface Props {
  post: PostMeta
}

export default function PostCard({ post }: Props) {
  const navigate = useNavigate()

  return (
    <article className="post-card" onClick={() => navigate(`/posts/${post.slug}`)}>
      <div className="post-card__header">
        {post.tags.length > 0 && (
          <div className="post-card__tags">
            {post.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
            {post.tags.length > 3 && (
              <span className="tag tag--default">...</span>
            )}
          </div>
        )}
        <h2 className="post-card__title">{post.title}</h2>
      </div>
      {post.description && (
        <p className="post-card__desc">{post.description}</p>
      )}
      <div className="post-card__footer">
        <time className="post-card__date">{post.date}</time>
        <span className="post-card__arrow">→</span>
      </div>
    </article>
  )
}
