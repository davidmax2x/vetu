import { ANALYTICS_EVENTS } from '@/lib/constants'
import { track } from './posthog'

// ─── Analysis Events ───────────────────────────────────────────────

/**
 * Track when color analysis is complete
 * @param season - The detected color season
 * @param confidence - Confidence score (0-1)
 */
export function analysisComplete(season: string, confidence: number): void {
  track(ANALYTICS_EVENTS.ANALYSIS_COMPLETE, { season, confidence })
}

/**
 * Track when the season is revealed to the user
 * @param season - The detected color season
 */
export function seasonRevealed(season: string): void {
  track(ANALYTICS_EVENTS.SEASON_REVEALED, { season })
}

// ─── Try-On Events ─────────────────────────────────────────────────

/**
 * Track when user requests a virtual try-on
 * @param outfitIndex - Index of the outfit being tried on
 */
export function tryonRequested(outfitIndex: number): void {
  track(ANALYTICS_EVENTS.TRYON_REQUESTED, { outfitIndex })
}

/**
 * Track when try-on is complete
 * @param durationMs - Duration of the try-on generation in milliseconds
 */
export function tryonComplete(durationMs: number): void {
  track(ANALYTICS_EVENTS.TRYON_COMPLETE, { durationMs })
}

// ─── Share Events ──────────────────────────────────────────────────

interface ShareCardCreatedProps {
  season: string
  isPro: boolean
}

/**
 * Track when a share card is created
 * @param season - The color season being shared
 * @param isPro - Whether the user is on Pro tier
 */
export function shareCardCreated(season: string, isPro: boolean): void {
  track(ANALYTICS_EVENTS.SHARE_CARD_CREATED, { season, isPro })
}

/**
 * Track when user shares a card
 * @param platform - The platform shared to (e.g., 'twitter', 'facebook', 'copy')
 */
export function shareCardShared(platform: string): void {
  track(ANALYTICS_EVENTS.SHARE_CARD_SHARED, { platform })
}

// ─── Referral Events ───────────────────────────────────────────────

/**
 * Track when referral code is sent
 * @param code - The referral code
 */
export function referralSent(code: string): void {
  track(ANALYTICS_EVENTS.REFERRAL_SENT, { code })
}

/**
 * Track when a referral converts to Pro
 * @param code - The referral code that converted
 */
export function referralConverted(code: string): void {
  track(ANALYTICS_EVENTS.REFERRAL_CONVERTED, { code })
}

// ─── Advisor Events ────────────────────────────────────────────────

/**
 * Track when user sends a message to the advisor
 * @param sessionCount - Number of messages in this session
 */
export function advisorMessage(sessionCount: number): void {
  track(ANALYTICS_EVENTS.ADVISOR_MESSAGE_SENT, { sessionCount })
}

// ─── Upgrade Events ────────────────────────────────────────────────

/**
 * Track when upgrade modal is shown
 * @param feature - The feature that triggered the modal
 */
export function upgradeModalShown(feature: string): void {
  track(ANALYTICS_EVENTS.UPGRADE_MODAL_SHOWN, { feature })
}

/**
 * Track when user clicks upgrade
 * @param feature - The feature that triggered the upgrade
 */
export function upgradeClicked(feature: string): void {
  track(ANALYTICS_EVENTS.UPGRADE_CLICKED, { feature })
}

/**
 * Track when user upgrades to Pro
 * @param source - Where the upgrade was initiated from
 */
export function upgradedToPro(source: string): void {
  track(ANALYTICS_EVENTS.UPGRADED_TO_PRO, { source })
}

// ─── Outfit Events ─────────────────────────────────────────────────

/**
 * Track when user saves an outfit
 */
export function outfitSaved(): void {
  track(ANALYTICS_EVENTS.OUTFIT_SAVED)
}

/**
 * Track when user likes an outfit
 */
export function outfitLiked(): void {
  track(ANALYTICS_EVENTS.OUTFIT_LIKED)
}

// ─── Shopping Events ───────────────────────────────────────────────

interface ShoppingClickedProps {
  retailer: string
  priceRange: string
}

/**
 * Track when user clicks a shopping link
 * @param retailer - The retailer name
 * @param priceRange - The price range category
 */
export function shoppingClicked(retailer: string, priceRange: string): void {
  track(ANALYTICS_EVENTS.SHOPPING_LINK_CLICKED, { retailer, priceRange })
}
