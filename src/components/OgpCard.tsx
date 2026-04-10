import { useQuery } from '@tanstack/react-query'

interface OgpData {
  title: string | null
  description: string | null
  image: string | null
  publisher: string | null
  url: string
}

async function fetchOgp(url: string): Promise<OgpData | null> {
  const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`)
  const json = await res.json()
  if (json.status !== 'success') return null
  return {
    title: json.data.title ?? null,
    description: json.data.description ?? null,
    image: json.data.image?.url ?? null,
    publisher: json.data.publisher ?? null,
    url: json.data.url ?? url,
  }
}

interface Props {
  url: string
}

export default function OgpCard({ url }: Props) {
  const { data, isPending, isError } = useQuery({
    queryKey: ['ogp', url],
    queryFn: () => fetchOgp(url),
    staleTime: Infinity,
    retry: false,
  })

  if (isPending) {
    return <span className="ogp-card ogp-card--loading" />
  }

  if (isError || !data) {
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