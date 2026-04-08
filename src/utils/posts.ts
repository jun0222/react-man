import type { Post, PostMeta } from '../types/post'

const modules = import.meta.glob('/posts/*.md', { query: '?raw', import: 'default', eager: true })

function slugFromPath(path: string): string {
  return path.replace(/^\/posts\//, '').replace(/\.md$/, '')
}

// gray-matter の代わり — Buffer 不使用のブラウザ向けパーサー
function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const normalized = raw.replace(/\r\n/g, '\n')
  if (!normalized.startsWith('---')) return { data: {}, content: normalized }

  const end = normalized.indexOf('\n---', 3)
  if (end === -1) return { data: {}, content: normalized }

  const yaml = normalized.slice(4, end)
  const content = normalized.slice(end + 4).trimStart()
  const data: Record<string, unknown> = {}

  let i = 0
  const lines = yaml.split('\n')
  while (i < lines.length) {
    const line = lines[i]
    const colon = line.indexOf(':')
    if (colon === -1) { i++; continue }

    const key = line.slice(0, colon).trim()
    const rest = line.slice(colon + 1).trim()

    // ブロック配列
    if (rest === '') {
      const items: string[] = []
      i++
      while (i < lines.length && lines[i].trimStart().startsWith('-')) {
        items.push(lines[i].trimStart().slice(1).trim().replace(/^["']|["']$/g, ''))
        i++
      }
      data[key] = items
      continue
    }

    // インライン配列 [a, b, c]
    if (rest.startsWith('[') && rest.endsWith(']')) {
      data[key] = rest.slice(1, -1)
        .split(',')
        .map(s => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
      i++; continue
    }

    if (rest === 'true')  { data[key] = true;  i++; continue }
    if (rest === 'false') { data[key] = false; i++; continue }
    if (/^-?\d+(\.\d+)?$/.test(rest)) { data[key] = Number(rest); i++; continue }

    // クォート除去
    data[key] = rest.replace(/^["']|["']$/g, '')
    i++
  }

  return { data, content }
}

export function getAllPosts(): Post[] {
  const posts: Post[] = []

  for (const [path, raw] of Object.entries(modules)) {
    const { data, content } = parseFrontmatter(raw as string)
    if (data.draft) continue

    posts.push({
      slug: slugFromPath(path),
      title: String(data.title ?? 'Untitled'),
      date: data.date ? String(data.date) : '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      description: String(data.description ?? ''),
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
