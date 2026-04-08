export interface PostMeta {
  slug: string
  title: string
  date: string
  tags: string[]
  description: string
  draft?: boolean
}

export interface Post extends PostMeta {
  content: string
}
