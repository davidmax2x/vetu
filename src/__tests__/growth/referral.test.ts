import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  generateReferralCode,
  createReferral,
  trackReferralClick,
  processReferralConversion,
  grantReferralReward,
  createCreatorSlug,
  getReferralStats,
} from '@/lib/growth/referral'

// Mock Supabase
const mockSupabase = {
  from: vi.fn(() => mockSupabase),
  select: vi.fn(() => mockSupabase),
  insert: vi.fn(() => mockSupabase),
  update: vi.fn(() => mockSupabase),
  eq: vi.fn(() => mockSupabase),
  single: vi.fn(() => mockSupabase),
  rpc: vi.fn(() => mockSupabase),
}

vi.mock('@/lib/db/client', () => ({
  getSupabaseAdmin: () => mockSupabase,
}))

vi.mock('@/lib/utils', () => ({
  generateId: () => 'abc12345xyz789',
}))

describe('Referral System', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateReferralCode', () => {
    it('generates an 8-character alphanumeric code', () => {
      const code = generateReferralCode('user-123')
      expect(code).toHaveLength(8)
      expect(code).toMatch(/^[a-z0-9]+$/)
    })
  })

  describe('createReferral', () => {
    it('creates a referral record', async () => {
      mockSupabase.insert.mockResolvedValue({ error: null })

      await createReferral('user-123', 'abc12345', 'creator-slug')

      expect(mockSupabase.from).toHaveBeenCalledWith('referrals')
      expect(mockSupabase.insert).toHaveBeenCalledWith({
        referrer_id: 'user-123',
        referral_code: 'abc12345',
        creator_slug: 'creator-slug',
        converted: false,
        reward_granted: false,
      })
    })

    it('throws on database error', async () => {
      mockSupabase.insert.mockResolvedValue({ error: new Error('DB error') })

      await expect(createReferral('user-123', 'abc12345')).rejects.toThrow('Failed to create referral')
    })
  })

  describe('createCreatorSlug', () => {
    it('creates a valid creator slug', async () => {
      mockSupabase.select.mockReturnValue({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({ data: null })),
        })),
      })
      mockSupabase.insert.mockResolvedValue({ error: null })

      const result = await createCreatorSlug('user-123', 'my-creator-name')

      expect('vanityUrl' in result).toBe(true)
      if ('vanityUrl' in result) {
        expect(result.vanityUrl).toBe('https://vetu.ai/by/my-creator-name')
      }
    })

    it('rejects invalid slugs', async () => {
      const result = await createCreatorSlug('user-123', 'AB')

      expect('error' in result).toBe(true)
      if ('error' in result) {
        expect(result.error).toContain('3-30 characters')
      }
    })

    it('rejects non-unique slugs', async () => {
      mockSupabase.select.mockReturnValue({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({ data: { id: 'existing' } })),
        })),
      })

      const result = await createCreatorSlug('user-123', 'taken-slug')

      expect('error' in result).toBe(true)
      if ('error' in result) {
        expect(result.error).toBe('Slug already taken')
      }
    })
  })

  describe('getReferralStats', () => {
    it('returns referral statistics', async () => {
      mockSupabase.select.mockReturnValue({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({ data: null })),
        })),
      })

      const stats = await getReferralStats('user-123')

      expect(stats).toHaveProperty('code')
      expect(stats).toHaveProperty('clicks')
      expect(stats).toHaveProperty('conversions')
      expect(stats).toHaveProperty('totalCommission')
    })
  })
})
