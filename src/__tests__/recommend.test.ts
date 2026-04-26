import { describe, it, expect } from 'vitest'
import { generateOutfits, OCCASIONS, OutfitSet } from '@/lib/outfitSchema'
import { getBodyTypeAdvice } from '@/lib/bodyTypeAdvice'

describe('outfitSchema', () => {
  it('generates outfits for all occasions', () => {
    OCCASIONS.forEach(occasion => {
      const result = generateOutfits(
        'True Autumn',
        'oval',
        { shoulderToHip: 'balanced', torsoLength: 'average' },
        'feminine',
        'global-western',
        occasion,
        'pro'
      )
      expect(result.outfits.length).toBe(4)
      expect(result.outfits[0].occasion).toBe(occasion)
      expect(result.outfits[0].items.length).toBeGreaterThan(0)
    })
  })

  it('returns correct tier gating for FREE', () => {
    const result = generateOutfits(
      'True Winter',
      'round',
      {},
      'feminine',
      'global-western',
      'everyday casual',
      'free'
    )
    expect(result.tier).toBe('free')
    expect(result.shown).toBe(2)
    expect(result.locked).toBe(2)
  })

  it('returns correct tier gating for PRO', () => {
    const result = generateOutfits(
      'True Winter',
      'round',
      {},
      'feminine',
      'global-western',
      'everyday casual',
      'pro'
    )
    expect(result.tier).toBe('pro')
    expect(result.shown).toBe(4)
    expect(result.locked).toBe(0)
  })

  it('generates masculine outfits', () => {
    const result = generateOutfits(
      'Bright Spring',
      'square',
      {},
      'masculine',
      'global-western',
      'work professional',
      'pro'
    )
    const outfit = result.outfits[0]
    expect(outfit.gender).toBe('masculine')
    expect(outfit.items.some(i => i.category === 'Top')).toBe(true)
    expect(outfit.items.some(i => i.category === 'Bottom')).toBe(true)
  })

  it('applies cultural context notes', () => {
    const result = generateOutfits(
      'Soft Summer',
      'heart',
      {},
      'feminine',
      'south-asian',
      'wedding guest',
      'pro'
    )
    const outfit = result.outfits[0]
    expect(outfit.culturalContext).toBe('south-asian')
    expect(outfit.styleNotes.length).toBeGreaterThan(10)
    if (outfit.occasion === 'wedding guest') {
      expect(outfit.items.some(i => i.name.toLowerCase().includes('lehenga'))).toBe(true)
    }
  })

  it('each outfit has valid suggested colors', () => {
    const result = generateOutfits(
      'True Spring',
      'oval',
      {},
      'feminine',
      'global-western',
      'date night',
      'pro'
    )
    result.outfits.forEach(outfit => {
      outfit.items.forEach(item => {
        item.suggestedColors.forEach(hex => {
          expect(hex).toMatch(/^#[0-9A-Fa-f]{6}$/)
        })
      })
    })
  })

  it('outfit IDs are unique', () => {
    const result = generateOutfits(
      'Deep Autumn',
      'diamond',
      {},
      'feminine',
      'global-western',
      'cocktail party',
      'pro'
    )
    const ids = result.outfits.map(o => o.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('bodyTypeAdvice', () => {
  it('returns advice for all standard shapes', () => {
    const shapes = ['balanced', 'broad-shoulders', 'broad-hips', 'narrow']
    shapes.forEach(shape => {
      const advice = getBodyTypeAdvice({ shoulderToHip: shape as any })
      expect(advice.bodyShape).toBeDefined()
      expect(advice.silhouetteGoal).toBeDefined()
      expect(advice.fitAdvice.length).toBeGreaterThan(0)
      expect(advice.proportionTips.length).toBeGreaterThan(0)
      expect(advice.avoidShapes.length).toBeGreaterThan(0)
      expect(advice.recommendedShapes.length).toBeGreaterThan(0)
    })
  })

  it('adjusts for petite height', () => {
    const advice = getBodyTypeAdvice({ height: 'petite' })
    const tips = advice.proportionTips.join(' ')
    // Petite advice mentions cropped lengths or elongation
    expect(
      tips.toLowerCase().includes('cropped') ||
      tips.toLowerCase().includes('elongate') ||
      tips.toLowerCase().includes('midi')
    ).toBe(true)
  })

  it('adjusts for tall height', () => {
    const advice = getBodyTypeAdvice({ height: 'tall' })
    const allText = [...advice.proportionTips, ...advice.fitAdvice].join(' ')
    // Tall advice mentions long lines, maxi lengths, or tall ranges
    expect(
      allText.toLowerCase().includes('long') ||
      allText.toLowerCase().includes('maxi') ||
      allText.toLowerCase().includes('bold')
    ).toBe(true)
  })

  it('adjusts for long torso', () => {
    const advice = getBodyTypeAdvice({ torsoLength: 'long' })
    const tips = advice.proportionTips.join(' ')
    expect(tips.toLowerCase()).toContain('high-waisted')
  })

  it('adjusts for short torso', () => {
    const advice = getBodyTypeAdvice({ torsoLength: 'short' })
    const tips = advice.proportionTips.join(' ')
    expect(tips.toLowerCase()).toContain('elongate')
  })

  it('maps curvy build to hourglass', () => {
    const advice = getBodyTypeAdvice({ build: 'curvy' })
    expect(advice.bodyShape).toBe('hourglass')
  })

  it('maps athletic build correctly', () => {
    const advice = getBodyTypeAdvice({ build: 'athletic' })
    expect(advice.bodyShape).toBe('athletic')
  })
})
