import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import OgpCard from './OgpCard'

// テスト間でキャッシュ衝突しないよう URL をユニークにする
let urlSuffix = 0
const url = () => `https://example.com/test-${urlSuffix++}`

const makeResponse = (data: object) => ({
  status: 'success',
  data: {
    title: 'サンプルタイトル',
    description: 'サンプル説明文',
    image: { url: 'https://example.com/image.png' },
    publisher: 'Example',
    url: 'https://example.com',
    ...data,
  },
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('OgpCard', () => {
  describe('データ取得中', () => {
    it('ローディング状態を表示する', () => {
      vi.stubGlobal('fetch', () => new Promise(() => {})) // 永遠に pending

      const { container } = render(<OgpCard url={url()} />)

      expect(container.querySelector('.ogp-card--loading')).toBeInTheDocument()
    })
  })

  describe('データ取得成功', () => {
    it('タイトル・説明・パブリッシャーを表示する', async () => {
      vi.stubGlobal('fetch', () =>
        Promise.resolve({ json: () => Promise.resolve(makeResponse({})) }),
      )

      render(<OgpCard url={url()} />)

      await waitFor(() => {
        expect(screen.getByText('サンプルタイトル')).toBeInTheDocument()
      })
      expect(screen.getByText('サンプル説明文')).toBeInTheDocument()
      expect(screen.getByText('Example')).toBeInTheDocument()
    })

    it('外部リンクとして target="_blank" / rel="noopener noreferrer" で開く', async () => {
      const testUrl = url()
      vi.stubGlobal('fetch', () =>
        Promise.resolve({ json: () => Promise.resolve(makeResponse({})) }),
      )

      render(<OgpCard url={testUrl} />)

      await waitFor(() => {
        const link = screen.getByRole('link')
        expect(link).toHaveAttribute('href', testUrl)
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })

    it('image がない場合も正常に表示する', async () => {
      vi.stubGlobal('fetch', () =>
        Promise.resolve({
          json: () =>
            Promise.resolve(makeResponse({ image: null })),
        }),
      )

      render(<OgpCard url={url()} />)

      await waitFor(() => {
        expect(screen.getByText('サンプルタイトル')).toBeInTheDocument()
      })
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })
  })

  describe('データ取得失敗', () => {
    it('fetch が reject した場合は URL をそのままリンク表示する', async () => {
      const testUrl = url()
      vi.stubGlobal('fetch', () => Promise.reject(new Error('Network error')))

      render(<OgpCard url={testUrl} />)

      await waitFor(() => {
        const link = screen.getByRole('link')
        expect(link).toHaveClass('ogp-card--fallback')
        expect(link).toHaveTextContent(testUrl)
      })
    })

    it('API が success 以外を返した場合もフォールバック表示する', async () => {
      const testUrl = url()
      vi.stubGlobal('fetch', () =>
        Promise.resolve({ json: () => Promise.resolve({ status: 'fail', data: {} }) }),
      )

      render(<OgpCard url={testUrl} />)

      await waitFor(() => {
        expect(screen.getByRole('link')).toHaveClass('ogp-card--fallback')
      })
    })
  })
})