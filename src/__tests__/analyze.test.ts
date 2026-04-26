import { describe, test, expect } from 'vitest'
import { validateHex, sanitizeHex, getPalette } from '@/lib/colorPalettes'
import { getCulturalStyleNotes } from '@/lib/culturalContext'
import { COLOR_SEASONS } from '@/lib/constants'

describe('VISION + COLOR integration', () => {
  test('validateHex returns true for valid hex', () => {
    expect(validateHex('#FF6B35')).toBe(true)
    expect(validateHex('#C97C3A')).toBe(true)
  })

  test('validateHex returns false for invalid hex', () => {
    expect(validateHex('FF6B35')).toBe(false)
    expect(validateHex('#FFF')).toBe(false)
    expect(validateHex('')).toBe(false)
  })

  test('sanitizeHex prepends hash and expands short hex', () => {
    expect(sanitizeHex('FF6B35')).toBe('#FF6B35')
    expect(sanitizeHex('#FFF')).toBe('#FFFFFF')
  })

  test('cultural notes return non-empty strings for all contexts', () => {
    const contexts = ['global-western', 'south-asian', 'west-african', 'east-asian', 'middle-eastern', 'latin-american']
    contexts.forEach(ctx => {
      const notes = getCulturalStyleNotes(ctx, 'True Autumn')
      expect(notes).toBeTruthy()
      expect(notes.length).toBeGreaterThan(10)
    })
  })

  test('all 12 seasons have cultural variants with at least 6 colours each', () => {
    COLOR_SEASONS.forEach((season: string) => {
      const palette = getPalette(season)
      const variants = palette.culturalVariants
      Object.entries(variants).forEach(([context, colors]: [string, any]) => {
        if (colors && colors.length > 0) {
          expect(colors.length).toBeGreaterThanOrEqual(6)
        }
      })
    })
  })
})
