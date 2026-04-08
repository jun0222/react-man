import matter from 'gray-matter'
import type { Post, PostMeta } from '../types/post'

// Import all MD files from the posts directory as raw strings
const modules = import.meta.glob('/posts/*.md', { query: '?raw', import: 'default', eager: true })

function slugFromPath(path: string): string {
  return path.replace(/^\/posts\//, '').replace(/\.md$/, '')
}

export function getAllPosts(): Post[] {
  const posts: Post[] = []

  for (const [path, raw] of Object.entries(modules)) {
    const { data, content } = matter(raw as string)
    if (data.draft) continue

    posts.push({
      slug: slugFromPath(path),
      title: data.title ?? 'Untitled',
      date: data.date ? String(data.date) : '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      description: data.description ?? '',
      content,
    })
  }

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug)
}

export function getAllMeta(): PostMeta[] {
  return getAllPosts().map(({ content: _content, ...meta }) => meta)
}
