import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    // ベースカラーをブログの配色に合わせる
    primaryColor: '#ffe033',
    primaryTextColor: '#0a0a0a',
    primaryBorderColor: '#0a0a0a',
    lineColor: '#0a0a0a',
    secondaryColor: '#fafafa',
    secondaryTextColor: '#0a0a0a',
    secondaryBorderColor: '#0a0a0a',
    tertiaryColor: '#f5f0e8',
    tertiaryTextColor: '#0a0a0a',
    tertiaryBorderColor: '#0a0a0a',
    background: '#f5f0e8',
    mainBkg: '#ffe033',
    nodeBorder: '#0a0a0a',
    clusterBkg: '#fafafa',
    titleColor: '#0a0a0a',
    edgeLabelBackground: '#f5f0e8',
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
    fontSize: '14px',
  },
})

let idCounter = 0

interface Props {
  code: string
}

export default function MermaidDiagram({ code }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const id = useRef(`mermaid-${idCounter++}`)

  useEffect(() => {
    if (!ref.current) return
    setError(null)

    mermaid
      .render(id.current, code)
      .then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Mermaid parse error')
      })
  }, [code])

  if (error) {
    return (
      <div className="mermaid-block mermaid-block--error">
        <span className="mermaid-block__label">mermaid</span>
        <pre className="mermaid-block__error-msg">{error}</pre>
      </div>
    )
  }

  return (
    <div className="mermaid-block">
      <span className="mermaid-block__label">mermaid</span>
      <div className="mermaid-block__svg" ref={ref} />
    </div>
  )
}