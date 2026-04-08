import { useEffect, useRef, useState } from 'react'
import hljs from 'highlight.js'

interface Props {
  code: string
  language: string
}

export default function CodeBlock({ code, language }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (ref.current) {
      ref.current.removeAttribute('data-highlighted')
      hljs.highlightElement(ref.current)
    }
  }, [code, language])

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const lang = language || 'plaintext'

  return (
    <div className="code-block">
      <div className="code-block__header">
        <span className="code-block__lang">{lang}</span>
        <button className={`code-block__copy${copied ? ' copied' : ''}`} onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre>
        <code ref={ref} className={`language-${lang}`}>
          {code}
        </code>
      </pre>
    </div>
  )
}
