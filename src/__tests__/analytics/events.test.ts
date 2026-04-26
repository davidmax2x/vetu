import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ANALYTICS_EVENTS } from '@/lib/constants'
import * as posthog from '@/lib/analytics/posthog'
import {
  analysisComplete,
  seasonRevealed,
  tryonRequested,
  tryonComplete,
  shareCardCreated,
  shareCardShared,
  referralSent,
  referralConverted,
  advisorMessage,
  upgradeModalShown,
  upgradeClicked,
  upgradedToPro,
  outfitSaved,
  outfitLiked,
  shoppingClicked,
} from '@/lib/analytics/events'

// Mock the posthog module
vi.mock('@/lib/analytics/posthog', () => ({
  track: vi.fn(),
  initAnalytics: vi.fn(),
  identify: vi.fn(),
  reset: vi.fn(),
  getPostHog: vi.fn(),
}))

describe('Analytics Events', () => {
  const trackSpy = vi.mocked(posthog.track)

  beforeEach(() => {
    trackSpy.mockClear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // ─── Analysis Events ───────────────────────────────────────────────

  describe('analysisComplete', () => {
    it('should call track with ANALYSIS_COMPLETE event', () => {
      analysisComplete('True Spring', 0.85)
      expect(trackSpy).toHaveBeenCalledWith(
        ANALYTICS_EVENTS.ANALYSIS_COMPLETE,
        { season: 'True Spring', confidence: 0.85 }
      )
    })

    it('should handle different seasons', () => {
      analysisComplete('Deep Winter', 0.92)
      expect(trackSpy).toHaveBeenCalledWith(
        ANALYTICS_EVENTS.ANALYSIS_COMPLETE,
        { season: 'Deep Winter', confidence: 0.92 }
      )
    })
  })

  describe('seasonRevealed', () => {
    it('should call track with SEASON_REVEALED event', () => {
      seasonRevealed('True Summer')
      expect(trackSpy).toHaveBeenCalledWith(
        ANALYTICS_EVENTS.SEASON_REVEALED,
        { season: 'True Summer' }
      )
    })
  })

  // ─── Try-On Events ─────────────────────────────────────────────────

  describe('tryonRequested', () => {
    it('should call track with TRYON_REQUESTED event', () => {
      tryonRequested(2)
      expect(trackSpy).toHaveBeenCalledWith(
        ANALYTICS_EVENTS.TRYON_REQUESTED,
        { outfitIndex: 2 }
      )
    })

    it('should handle first outfit index', () => {
      tryonRequested(0)
      expect(trackSpy).toHaveBeenCalledWith(
        ANALYTICS_EVENTS.TRYON_REQUESTED,
        { outfitIndex: 0 }
      )
    })
  })

  describe('tryonComplete', () => {
    it('should call track with TRYON_COMPLETE event', () => {
      tryonComplete(3200)
      expect(trackSpy).toHaveBeenCalledWith(
        ANALYTICS_EVENTS.TRYON_COMPLETE,
        { durationMs: 3200 }
      )
    })

    it('should handle fast completion', () => {
      tryonComplete(800)
      expect(trackSpy).toHaveBeenCalledWith(
        ANALYTICS_EVENTS.TRYON_COMPLETE,
        { durationMs: 800 }
      )
    })
  })

  // ─── Share Events ──────────────────────────────────────────────────

  describe('shareCardCreated', () => {
    it('should call track with SHARE_CARD_CREATED event for Pro users', () => {
      shareCardCreated('True Spring', true)
      expect(trackSpy).toHaveBeenCalledWith(
        ANALYTICS_EVENTS.SHARE_CARD_CREATED,
        { season: 'True Spring', isPro: true }
      )
    })

    it('should call track with SHARE_CARD_CREATED event for Free users', () => {
      shareCardCreated('Deep Autumn', false)
      expect(trackSpy).toHaveBeenCalledWith(
        ANALYTICS_EVENTS.SHARE_CARD_CREATED,
        { season: 'Deep Autumn', isPro: false }
      )
    })
  })

  describe('shareCardShared', () => {
    it('should call track with SHARE_CARD_SHARED event for twitter', () => {
      shareCardShared('twitter')
      expect(trackSpy).toHaveBeenCalledWith(
        ANALYTICS_EVENTS.SHARE_CARD_SHARED,
        { platform: 'twitter' }
      )
    })

    it('should call track with SHARE_CARD_SHARED event for copy', () => {
      shareCardShared('copy')
      expect(trackSpy).toHaveBeenCalledWith(
        ANALYTICS_EVENTS.SHARE_CARD_SHARED,
        { platform: 'copy' }
      )
    })
  })

  // ─── Referral Events ─────────────────────────────────────────────

  describe('referralSent', () => {
    it('should call track with REFERRAL_SENT event', () => {
      referralSent('ABC123')
      expect(trackSpy).toHaveBeenCalledWith(
        ANALYTICS_EVENTS.REFERRAL_SENT,
        { code: 'ABC123' }
      )
    })
  })

  describe('referralConverted', () => {
    it('should call track with REFERRAL_CONVERTED event', () => {
      referralConverted('ABC123')
      expect(trackSpy).toHaveBeenCalledWith(
        ANALYTICS_EVENTS.REFERRAL_CONVERTED,
        { code: 'ABC123' }
      )
    })
  })

  // ─── Advisor Events ────────────────────────────────────────────────

  describe('advisorMessage', () => {
    it('should call track with ADVISOR_MESSAGE_SENT event', () => {
      advisorMessage(5)
      expect(trackSpy).toHaveBeenCalledWith(
        ANALYTICS_EVENTS.ADVISOR_MESSAGE_SENT,
        { sessionCount: 5 }
      )
    })

    it('should handle first message', () => {
      advisorMessage(1)
      expect(trackSpy).toHaveBeenCalledWith(
        ANALYTICS_EVENTS.ADVISOR_MESSAGE_SENT,
        { sessionCount: 1 }
      )
    })
  })

  // ─── Upgrade Events ──────────────────────────────────────────────

  describe('upgradeModalShown', () => {
    it('should call track with UPGRADE_MODAL_SHOWN event', () => {
      upgradeModalShown('tryon')
      expect(trackSpy).toHaveBeenCalledWith(
        ANALYTICS_EVENTS.UPGRADE_MODAL_SHOWN,
        { feature: 'tryon' }
      )
    })

    it('should handle advisor feature', () => {
      upgradeModalShown('advisor')
      expect(trackSpy).toHaveBeenCalledWith(
        ANALYTICS_EVENTS.UPGRADE_MODAL_SHOWN,
        { feature: 'advisor' }
      )
    })
  })

  describe('upgradeClicked', () => {
    it('should call track with UPGRADE_CLICKED event', () => {
      upgradeClicked('tryon')
      expect(trackSpy).toHaveBeenCalledWith(
        ANALYTICS_EVENTS.UPGRADE_CLICKED,
        { feature: 'tryon' }
      )
    })
  })

  describe('upgradedToPro', () => {
    it('should call track with UPGRADED_TO_PRO event', () => {
      upgradedToPro('modal')
      expect(trackSpy).toHaveBeenCalledWith(
        ANALYTICS_EVENTS.UPGRADED_TO_PRO,
        { source: 'modal' }
      )
    })

    it('should handle settings upgrade', () => {
      upgradedToPro('settings')
      expect(trackSpy).toHaveBeenCalledWith(
        ANALYTICS_EVENTS.UPGRADED_TO_PRO,
        { source: 'settings' }
      )
    })
  })

  // ─── Outfit Events ─────────────────────────────────────────────────

  describe('outfitSaved', () => {
    it('should call track with OUTFIT_SAVED event', () => {
      outfitSaved()
      expect(trackSpy).toHaveBeenCalledWith(ANALYTICS_EVENTS.OUTFIT_SAVED)
    })

    it('should not pass additional properties', () => {
      outfitSaved()
      expect(trackSpy).toHaveBeenCalledTimes(1)
      const [, properties] = trackSpy.mock.calls[0]
      expect(properties).toBeUndefined()
    })
  })

  describe('outfitLiked', () => {
    it('should call track with OUTFIT_LIKED event', () => {
      outfitLiked()
      expect(trackSpy).toHaveBeenCalledWith(ANALYTICS_EVENTS.OUTFIT_LIKED)
    })
  })

  // ─── Shopping Events ─────────────────────────────────────────────

  describe('shoppingClicked', () => {
    it('should call track with SHOPPING_LINK_CLICKED event', () => {
      shoppingClicked('ASOS', '£50-£100')
      expect(trackSpy).toHaveBeenCalledWith(
        ANALYTICS_EVENTS.SHOPPING_LINK_CLICKED,
        { retailer: 'ASOS', priceRange: '£50-£100' }
      )
    })

    it('should handle different retailers', () => {
      shoppingClicked('Farfetch', '£200+')
      expect(trackSpy).toHaveBeenCalledWith(
        ANALYTICS_EVENTS.SHOPPING_LINK_CLICKED,
        { retailer: 'Farfetch', priceRange: '£200+' }
      )
    })
  })
})

describe('PostHog Initialization', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    // Reset window mock
    vi.stubGlobal('window', undefined)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should check for window before running initAnalytics', async () => {
    // Import the module fresh to test window check
    const { initAnalytics } = await import('@/lib/analytics/posthog')

    // Should not throw when window is undefined
    expect(() => initAnalytics()).not.toThrow()
  })

  it('should check for window before running track', async () => {
    const { track: trackFn } = await import('@/lib/analytics/posthog')

    // Should not throw when window is undefined
    expect(() => trackFn('test_event', { foo: 'bar' })).not.toThrow()
  })
})
