const TAG_COLORS: Record<string, string> = {
  react: 'blue',
  typescript: 'blue',
  javascript: 'orange',
  js: 'orange',
  ts: 'blue',
  css: 'pink',
  html: 'orange',
  vite: 'green',
  frontend: 'pink',
  web: 'green',
  hooks: 'blue',
  performance: 'green',
}

function getTagColor(tag: string): string {
  return TAG_COLORS[tag.toLowerCase()] ?? 'default'
}

interface Props {
  tag: string
}

export default function TagBadge({ tag }: Props) {
  return <span className={`tag tag--${getTagColor(tag)}`}>{tag}</span>
}
