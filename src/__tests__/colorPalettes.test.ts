import { getPalette, validateHex, sanitizeHex, getSeasonFromSubSeason } from '@/lib/colorPalettes'
import { COLOR_SEASONS } from '@/lib/constants'

describe('colorPalettes', () => {
  test('all 12 seasons have valid palettes', () => {
    COLOR_SEASONS.forEach(season => {
      const palette = getPalette(season)
      expect(palette).toBeDefined()
      expect(palette.best.length).toBeGreaterThanOrEqual(8)
      expect(palette.neutral.length).toBeGreaterThanOrEqual(5)
      expect(palette.avoid.length).toBeGreaterThanOrEqual(5)
      expect(palette.names.best.length).toBe(palette.best.length)
      expect(palette.names.neutral.length).toBe(palette.neutral.length)
      expect(palette.names.avoid.length).toBe(palette.avoid.length)
      expect(palette.metallic).toMatch(/gold|silver|rose-gold|mixed/)
      expect(palette.description.length).toBeGreaterThan(10)
    })
  })

  test('all palette hex codes are valid', () => {
    COLOR_SEASONS.forEach(season => {
      const palette = getPalette(season)
      ;[...palette.best, ...palette.neutral, ...palette.avoid].forEach(hex => {
        expect(validateHex(hex)).toBe(true)
      })
    })
  })

  test('hex validator works correctly', () => {
    expect(validateHex('#FF6B35')).toBe(true)
    expect(validateHex('FF6B35')).toBe(false)
    expect(validateHex('#FFF')).toBe(false)
    expect(validateHex('#ff6b35')).toBe(true)
  })

  test('hex sanitizer works correctly', () => {
    expect(sanitizeHex('FF6B35')).toBe('#FF6B35')
    expect(sanitizeHex('#FFF')).toBe('#FFFFFF')
    expect(sanitizeHex('#ff6b35')).toBe('#FF6B35')
  })

  test('season from sub-season mapping works', () => {
    expect(getSeasonFromSubSeason('spring')).toBe('True Spring')
    expect(getSeasonFromSubSeason('summer')).toBe('True Summer')
    expect(getSeasonFromSubSeason('autumn')).toBe('True Autumn')
    expect(getSeasonFromSubSeason('winter')).toBe('True Winter')
  })

  test('cultural variants exist for all seasons', () => {
    COLOR_SEASONS.forEach(season => {
      const palette = getPalette(season)
      expect(palette.culturalVariants).toBeDefined()
      const variants = palette.culturalVariants
      if (variants['south-asian']) {
        expect(variants['south-asian'].length).toBeGreaterThanOrEqual(6)
      }
      if (variants['west-african']) {
        expect(variants['west-african'].length).toBeGreaterThanOrEqual(6)
      }
      if (variants['east-asian']) {
        expect(variants['east-asian'].length).toBeGreaterThanOrEqual(6)
      }
    })
  })

  test('cultural variant colours exist and are valid', () => {
    COLOR_SEASONS.forEach(season => {
      const palette = getPalette(season)
      Object.entries(palette.culturalVariants).forEach(([context, colors]) => {
        if (colors && colors.length > 0) {
          const uniqueColors = [...new Set(colors)]
          // Cultural variants should have at least 5 unique valid hex colours
          expect(uniqueColors.length).toBeGreaterThanOrEqual(5)
          uniqueColors.forEach(hex => {
            expect(validateHex(hex)).toBe(true)
          })
        }
      })
    })
  })
})
