import { describe, it, expect } from 'vitest'
import { TIERS, PRICING } from '@/lib/constants'
import { checkEntitlement } from '@/lib/billing/entitlements'

describe('Billing & Entitlements', () => {
  it('FREE tier has correct limits', () => {
    const free = TIERS.FREE
    expect(free.analysesPerMonth).toBe(2)
    expect(free.tryonEnabled).toBe(false)
    expect(free.advisorMessagesPerMonth).toBe(3)
    expect(free.pdfExport).toBe(false)
    expect(free.wardrobeHistory).toBe(false)
    expect(free.outfitsShown).toBe(2)
    expect(free.outfitsLocked).toBe(2)
  })

  it('PRO tier unlocks all features', () => {
    const pro = TIERS.PRO
    expect(pro.analysesPerMonth).toBe(Number.POSITIVE_INFINITY)
    expect(pro.tryonEnabled).toBe(true)
    expect(pro.advisorMessagesPerMonth).toBe(Number.POSITIVE_INFINITY)
    expect(pro.pdfExport).toBe(true)
    expect(pro.wardrobeHistory).toBe(true)
    expect(pro.outfitsShown).toBe(4)
    expect(pro.outfitsLocked).toBe(0)
  })

  it('PRO pricing is defined', () => {
    expect(PRICING.PRO_MONTHLY).toBeGreaterThan(0)
    expect(PRICING.PRO_ANNUAL).toBeGreaterThan(0)
  })

  const hasSupabase = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY

  it.skipIf(!hasSupabase)('entitlement check returns correct structure', async () => {
    const result = await checkEntitlement('anonymous', 'tryon')
    expect(result).toHaveProperty('allowed')
    expect(result).toHaveProperty('reason')
  })

  it('entitlement check function exists', () => {
    expect(typeof checkEntitlement).toBe('function')
  })

  it('tier gating shows correct number of outfits', () => {
    expect(TIERS.FREE.outfitsShown).toBe(2)
    expect(TIERS.FREE.outfitsLocked).toBe(2)
    expect(TIERS.PRO.outfitsShown).toBe(4)
    expect(TIERS.PRO.outfitsLocked).toBe(0)
  })
})
