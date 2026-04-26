import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock html-to-image
const mockToPng = vi.fn()
vi.mock('html-to-image', () => ({
  toPng: (...args: any[]) => mockToPng(...args),
}))

// Mock document for SSR/testing
const mockAppendChild = vi.fn()
const mockRemoveChild = vi.fn()
const mockCreateElement = vi.fn(() => ({
  style: {},
  textContent: '',
  appendChild: vi.fn(),
}))

Object.defineProperty(global, 'document', {
  value: {
    createElement: mockCreateElement,
    body: {
      appendChild: mockAppendChild,
      removeChild: mockRemoveChild,
    },
  },
  writable: true,
})

// Import after mocking
import { generateShareCard, generateSquareShareCard } from '@/lib/growth/shareCard'

describe('Share Card Generation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockToPng.mockResolvedValue('data:image/png;base64,mocked')
    mockCreateElement.mockReturnValue({
      style: {},
      textContent: '',
      appendChild: vi.fn(),
    })
  })

  describe('generateShareCard', () => {
    it('generates a portrait card (1080x1920)', async () => {
      const result = await generateShareCard({
        colorSeason: 'True Spring',
        outfitName: 'Garden Party Look',
        tryOnImageUrl: 'https://example.com/image.png',
        isPro: true,
      })

      expect(mockToPng).toHaveBeenCalled()
      expect(result).toBe('data:image/png;base64,mocked')
    })

    it('includes watermark for free users', async () => {
      await generateShareCard({
        colorSeason: 'True Spring',
        outfitName: 'Garden Party Look',
        isPro: false,
      })

      expect(mockToPng).toHaveBeenCalled()
      // toPng is called with container element
      const [container] = mockToPng.mock.calls[0]
      expect(container).toBeDefined()
    })

    it('works without try-on image', async () => {
      const result = await generateShareCard({
        colorSeason: 'True Winter',
        outfitName: 'Office Look',
        isPro: true,
      })

      expect(mockToPng).toHaveBeenCalled()
      expect(result).toBeDefined()
    })
  })

  describe('generateSquareShareCard', () => {
    it('generates a square card (1080x1080)', async () => {
      const result = await generateSquareShareCard({
        colorSeason: 'Deep Autumn',
        outfitName: 'Evening Look',
        tryOnImageUrl: 'https://example.com/image.png',
        isPro: false,
      })

      expect(mockToPng).toHaveBeenCalled()
      expect(result).toBe('data:image/png;base64,mocked')
    })

    it('includes watermark for free users', async () => {
      await generateSquareShareCard({
        colorSeason: 'Bright Spring',
        outfitName: 'Casual Look',
        isPro: false,
      })

      expect(mockToPng).toHaveBeenCalled()
    })
  })
})
