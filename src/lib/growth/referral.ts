import { generateId } from '@/lib/utils'
import { CREATOR_REFERRAL_COMMISSION, REFERRAL_REWARD_ANALYSES } from '@/lib/constants'
import { getSupabaseAdmin } from '@/lib/db/client'

/**
 * Generate a unique referral code for a user.
 * Returns an 8-character alphanumeric code.
 */
export function generateReferralCode(userId: string): string {
  // Generate a short code
  const code = generateId().slice(0, 8).toLowerCase()
  return code
}

/**
 * Create a referral tracking record.
 */
export async function createReferral(
  referrerId: string,
  code: string,
  creatorSlug?: string
): Promise<void> {
  const supabase = getSupabaseAdmin()

  const { error } = await supabase.from('referrals').insert({
    referrer_id: referrerId,
    referral_code: code,
    creator_slug: creatorSlug || null,
    converted: false,
    reward_granted: false,
  })

  if (error) {
    console.error('Error creating referral:', error)
    throw new Error('Failed to create referral')
  }
}

/**
 * Track a referral link click.
 */
export async function trackReferralClick(code: string): Promise<void> {
  const supabase = getSupabaseAdmin()

  // Update click count
  const { error } = await supabase.rpc('increment_referral_clicks', {
    referral_code: code,
  })

  if (error) {
    console.error('Error tracking referral click:', error)
  }
}

/**
 * Process a referral conversion when a new user signs up.
 * Marks the referral as converted and grants rewards.
 */
export async function processReferralConversion(
  code: string,
  newUserId: string
): Promise<void> {
  const supabase = getSupabaseAdmin()

  // Find the referral
  const { data: referral, error: findError } = await supabase
    .from('referrals')
    .select('*')
    .eq('referral_code', code)
    .single()

  if (findError || !referral) {
    console.error('Referral not found:', code)
    return
  }

  // Update referral as converted
  const { error: updateError } = await supabase
    .from('referrals')
    .update({
      referred_id: newUserId,
      converted: true,
      conversion_at: new Date().toISOString(),
    })
    .eq('id', referral.id)

  if (updateError) {
    console.error('Error updating referral:', updateError)
    return
  }

  // Grant reward to referrer
  await grantReferralReward(referral.referrer_id)
}

/**
 * Grant referral reward to the referrer.
 * Free users get +1 analysis, Pro users get recognition.
 */
export async function grantReferralReward(referrerId: string): Promise<void> {
  const supabase = getSupabaseAdmin()

  // Get referrer's tier
  const { data: entitlement } = await supabase
    .from('entitlements')
    .select('tier')
    .eq('user_id', referrerId)
    .single()

  if (!entitlement) return

  if (entitlement.tier === 'free') {
    // Grant +1 free analysis
    await supabase.rpc('grant_referral_analysis', {
      user_id: referrerId,
      count: REFERRAL_REWARD_ANALYSES,
    })
  }
  // Pro users get recognition (tracked in UI)
}

/**
 * Create a creator slug for the creator programme.
 * Validates URL-safe, 3-30 characters, unique.
 */
export async function createCreatorSlug(
  userId: string,
  slug: string
): Promise<{ vanityUrl: string } | { error: string }> {
  const supabase = getSupabaseAdmin()

  // Validate slug
  if (!/^[a-z0-9-]{3,30}$/.test(slug)) {
    return { error: 'Slug must be 3-30 characters, lowercase alphanumeric and hyphens only' }
  }

  // Check uniqueness
  const { data: existing } = await supabase
    .from('creator_programmes')
    .select('id')
    .eq('creator_slug', slug)
    .single()

  if (existing) {
    return { error: 'Slug already taken' }
  }

  // Create creator programme
  const { error } = await supabase.from('creator_programmes').insert({
    user_id: userId,
    creator_slug: slug,
    active: true,
  })

  if (error) {
    console.error('Error creating creator programme:', error)
    return { error: 'Failed to create creator programme' }
  }

  return { vanityUrl: `https://vetu.ai/by/${slug}` }
}

/**
 * Track creator referral conversion and commission.
 */
export async function trackCreatorConversion(
  creatorSlug: string,
  referredUserId: string
): Promise<void> {
  const supabase = getSupabaseAdmin()

  // Find creator
  const { data: creator } = await supabase
    .from('creator_programmes')
    .select('*')
    .eq('creator_slug', creatorSlug)
    .single()

  if (!creator) return

  // Track conversion
  await supabase.from('referrals').insert({
    referrer_id: creator.user_id,
    referred_id: referredUserId,
    creator_slug: creatorSlug,
    converted: true,
    conversion_at: new Date().toISOString(),
  })

  // Commission is calculated and paid out monthly
  // This would be handled by a Stripe Transfer or similar
}

/**
 * Get referral stats for a user.
 */
export async function getReferralStats(userId: string): Promise<{
  code: string | null
  clicks: number
  conversions: number
  totalCommission: number
}> {
  const supabase = getSupabaseAdmin()

  const { data: referrals } = await supabase
    .from('referrals')
    .select('referral_code, converted')
    .eq('referrer_id', userId)

  const code = referrals?.[0]?.referral_code || null
  const conversions = referrals?.filter(r => r.converted).length || 0

  // Get creator programme if exists
  const { data: creator } = await supabase
    .from('creator_programmes')
    .select('total_commission_gbp')
    .eq('user_id', userId)
    .single()

  return {
    code,
    clicks: 0, // Would need click tracking table
    conversions,
    totalCommission: creator?.total_commission_gbp || 0,
  }
}
