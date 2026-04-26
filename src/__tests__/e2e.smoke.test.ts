import { describe, it, expect } from 'vitest'
import { generateOutfits } from '@/lib/outfitSchema'
import { getPalette } from '@/lib/colorPalettes'
import { getBodyTypeAdvice } from '@/lib/bodyTypeAdvice'
import { getStyleRecommendations } from '@/lib/styleRecommendations'

describe('E2E Smoke Tests', () => {
  it('full user journey: analyze → recommend → outfit', () => {
    // Simulate analysis results
    const season = 'Soft Summer'
    const faceShape = 'heart'
    const bodyProportions = { shoulderToHip: 'wider', build: 'curvy', torsoLength: 'average', height: 'average' }
    const gender = 'feminine'
    const culturalContext = 'global-western'
    const occasion = 'wedding guest'
    const tier = 'pro'

    // 1. Palette
    const palette = getPalette(season)
    expect(palette.best.length).toBeGreaterThan(0)

    // 2. Style recommendations
    const styleRecs = getStyleRecommendations(season, faceShape, bodyProportions, gender, culturalContext)
    expect(styleRecs.necklineAdvice).toBeTruthy()
    expect(styleRecs.silhouetteAdvice).toBeTruthy()

    // 3. Body type advice
    const bodyAdvice = getBodyTypeAdvice(bodyProportions)
    expect(bodyAdvice.bodyShape).toBeTruthy()
    expect(bodyAdvice.fitAdvice.length).toBeGreaterThan(0)

    // 4. Outfit generation
    const outfitSet = generateOutfits(season, faceShape, bodyProportions, gender, culturalContext, occasion, tier)
    expect(outfitSet.outfits.length).toBe(4)
    expect(outfitSet.tier).toBe('pro')
    expect(outfitSet.locked).toBe(0)

    // 5. Validate outfit structure
    outfitSet.outfits.forEach((outfit: any) => {
      expect(outfit.id).toBeTruthy()
      expect(outfit.name).toBeTruthy()
      expect(outfit.items.length).toBeGreaterThan(0)
      outfit.items.forEach((item: any) => {
        expect(item.name).toBeTruthy()
        expect(item.suggestedColors.length).toBeGreaterThan(0)
      })
    })
  })

  it('free tier journey gates correctly', () => {
    const outfitSet = generateOutfits('Deep Autumn', 'round', {}, 'masculine', 'global-western', 'everyday casual', 'free')
    expect(outfitSet.shown).toBe(2)
    expect(outfitSet.locked).toBe(2)
  })

  it('cultural context modifies outfits', () => {
    const western = generateOutfits('True Spring', 'oval', {}, 'feminine', 'global-western', 'wedding guest', 'pro')
    const southAsian = generateOutfits('True Spring', 'oval', {}, 'feminine', 'south-asian', 'wedding guest', 'pro')

    const westernHasLehenga = western.outfits[0].items.some((i: any) => i.name.toLowerCase().includes('lehenga'))
    const southAsianHasLehenga = southAsian.outfits[0].items.some((i: any) => i.name.toLowerCase().includes('lehenga'))

    expect(westernHasLehenga).toBe(false)
    expect(southAsianHasLehenga).toBe(true)
  })
})
