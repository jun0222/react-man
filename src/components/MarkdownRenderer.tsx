import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import type { Components } from 'react-markdown'
import CodeBlock from './CodeBlock'
import OgpCard from './OgpCard'

const components: Components = {
  a({ href, children }) {
    const text = String(children)
    if (href && text === href && /^https?:\/\//.test(href)) {
      return <OgpCard url={href} />
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  },
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className ?? '')
    const isInline = !match

    if (isInline) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      )
    }

    const lang = match[1]
    const code = String(children).replace(/\n$/, '')

    return <CodeBlock code={code} language={lang} />
  },
  pre({ children }) {
    // CodeBlock already wraps in <pre>, so unwrap here
    return <>{children}</>
  },
}

interface Props {
  content: string
}

export default function MarkdownRenderer({ content }: Props) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
