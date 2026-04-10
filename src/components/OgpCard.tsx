import { use, Suspense } from 'react'

interface OgpData {
  title: string | null
  description: string | null
  image: string | null
  publisher: string | null
  url: string
}

const cache = new Map<string, Promise<OgpData | null>>()

function fetchOgp(url: string): Promise<OgpData | null> {
  if (!cache.has(url)) {
    cache.set(
      url,
      fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.status !== 'success') return null
          return {
            title: json.data.title ?? null,
            description: json.data.description ?? null,
            image: json.data.image?.url ?? null,
            publisher: json.data.publisher ?? null,
            url: json.data.url ?? url,
          }
        })
        .catch(() => null),
    )
  }
  return cache.get(url)!
}

function OgpCardInner({ url }: { url: string }) {
  const data = use(fetchOgp(url))

  if (!data) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="ogp-card ogp-card--fallback">
        {url}
      </a>
    )
  }

  const domain = (() => {
    try { return new URL(url).hostname } catch { return url }
  })()

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="ogp-card">
      {data.image && (
        <div className="ogp-card__image">
          <img src={data.image} alt={data.title ?? ''} loading="lazy" />
        </div>
      )}
      <div className="ogp-card__body">
        {data.title && <p className="ogp-card__title">{data.title}</p>}
        {data.description && <p className="ogp-card__desc">{data.description}</p>}
        <p className="ogp-card__domain">{data.publisher ?? domain}</p>
      </div>
    </a>
  )
}

interface Props {
  url: string
}

export default function OgpCard({ url }: Props) {
  return (
    <Suspense fallback={<span className="ogp-card ogp-card--loading" />}>
      <OgpCardInner url={url} />
    </Suspense>
  )
}