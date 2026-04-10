import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import OgpCard from './OgpCard'

const makeResponse = (overrides: object = {}) => ({
  status: 'success',
  data: {
    title: 'サンプルタイトル',
    description: 'サンプル説明文',
    image: { url: 'https://example.com/image.png' },
    publisher: 'Example',
    url: 'https://example.com',
    ...overrides,
  },
})

// テストごとにキャッシュをリセットするため QueryClient を都度生成
function renderCard(url: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <OgpCard url={url} />
    </QueryClientProvider>,
  )
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('OgpCard', () => {
  describe('データ取得中', () => {
    it('ローディング状態を表示する', () => {
      vi.stubGlobal('fetch', () => new Promise(() => {}))

      const { container } = renderCard('https://example.com/loading')

      expect(container.querySelector('.ogp-card--loading')).toBeInTheDocument()
    })
  })

  describe('データ取得成功', () => {
    it('タイトル・説明・パブリッシャーを表示する', async () => {
      vi.stubGlobal('fetch', () =>
        Promise.resolve({ json: () => Promise.resolve(makeResponse()) }),
      )

      renderCard('https://example.com/success-1')

      await waitFor(() => {
        expect(screen.getByText('サンプルタイトル')).toBeInTheDocument()
      })
      expect(screen.getByText('サンプル説明文')).toBeInTheDocument()
      expect(screen.getByText('Example')).toBeInTheDocument()
    })

    it('外部リンクとして target="_blank" / rel="noopener noreferrer" で開く', async () => {
      const url = 'https://example.com/success-2'
      vi.stubGlobal('fetch', () =>
        Promise.resolve({ json: () => Promise.resolve(makeResponse()) }),
      )

      renderCard(url)

      await waitFor(() => {
        const link = screen.getByRole('link')
        expect(link).toHaveAttribute('href', url)
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })

    it('image がない場合も正常に表示する', async () => {
      vi.stubGlobal('fetch', () =>
        Promise.resolve({ json: () => Promise.resolve(makeResponse({ image: null })) }),
      )

      renderCard('https://example.com/success-3')

      await waitFor(() => {
        expect(screen.getByText('サンプルタイトル')).toBeInTheDocument()
      })
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })
  })

  describe('データ取得失敗', () => {
    it('fetch が reject した場合は URL をそのままリンク表示する', async () => {
      const url = 'https://example.com/fail-1'
      vi.stubGlobal('fetch', () => Promise.reject(new Error('Network error')))

      renderCard(url)

      await waitFor(() => {
        const link = screen.getByRole('link')
        expect(link).toHaveClass('ogp-card--fallback')
        expect(link).toHaveTextContent(url)
      })
    })

    it('API が success 以外を返した場合もフォールバック表示する', async () => {
      vi.stubGlobal('fetch', () =>
        Promise.resolve({ json: () => Promise.resolve({ status: 'fail', data: {} }) }),
      )

      renderCard('https://example.com/fail-2')

      await waitFor(() => {
        expect(screen.getByRole('link')).toHaveClass('ogp-card--fallback')
      })
    })
  })
})