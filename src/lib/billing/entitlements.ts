import { getSupabaseAdmin } from '@/lib/db/client'
import { TIERS } from '@/lib/constants'

export interface EntitlementResult {
  allowed: boolean
  tier: 'free' | 'pro' | 'api'
  reason?: string
  upgradeUrl?: string
}

export async function checkEntitlement(
  userId: string,
  feature: string
): Promise<EntitlementResult> {
  const supabase = getSupabaseAdmin()

  // Fetch user's tier and usage
  const { data: entitlement } = await supabase
    .from('entitlements')
    .select('tier')
    .eq('user_id', userId)
    .single()

  const tier = (entitlement?.tier || 'free') as 'free' | 'pro' | 'api'
  const tierConfig = TIERS[tier.toUpperCase() as 'FREE' | 'PRO' | 'API']

  // Feature-specific checks
  switch (feature) {
    case 'analyse':
      if (tierConfig.analysesPerMonth === Infinity) {
        return { allowed: true, tier }
      }
      const analysisCount = await getMonthlyUsage(userId, 'analysis')
      if (analysisCount >= tierConfig.analysesPerMonth) {
        return {
          allowed: false,
          tier,
          reason: `You've used ${analysisCount} of ${tierConfig.analysesPerMonth} analyses this month. Upgrade for unlimited analyses.`,
          upgradeUrl: '/upgrade',
        }
      }
      return { allowed: true, tier }

    case 'tryon':
      if (!tierConfig.tryonEnabled) {
        return {
          allowed: false,
          tier,
          reason: 'Virtual try-on is a Pro feature. Upgrade to unlock it.',
          upgradeUrl: '/upgrade',
        }
      }
      return { allowed: true, tier }

    case 'wardrobe':
      if (!tierConfig.wardrobeHistory) {
        return {
          allowed: false,
          tier,
          reason: 'Wardrobe history is a Pro feature. Upgrade to save outfits.',
          upgradeUrl: '/upgrade',
        }
      }
      return { allowed: true, tier }

    case 'advisor':
      if (tierConfig.advisorMessagesPerMonth === Infinity) {
        return { allowed: true, tier }
      }
      const msgCount = await getMonthlyUsage(userId, 'advisor_message')
      if (msgCount >= tierConfig.advisorMessagesPerMonth) {
        return {
          allowed: false,
          tier,
          reason: `You've used ${msgCount} of ${tierConfig.advisorMessagesPerMonth} advisor messages this month.`,
          upgradeUrl: '/upgrade',
        }
      }
      return { allowed: true, tier }

    case 'pdf_export':
      if (!tierConfig.pdfExport) {
        return {
          allowed: false,
          tier,
          reason: 'PDF export is a Pro feature.',
          upgradeUrl: '/upgrade',
        }
      }
      return { allowed: true, tier }

    case 'outfit_recommendation':
      return { allowed: true, tier }

    default:
      return { allowed: true, tier }
  }
}

export async function incrementUsage(userId: string, feature: string): Promise<void> {
  const supabase = getSupabaseAdmin()

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  // Upsert usage record
  await supabase
    .from('usage')
    .upsert(
      {
        user_id: userId,
        feature,
        year,
        month,
        count: 1,
      },
      { onConflict: 'user_id,feature,year,month' }
    )

  // Increment count using raw query (Supabase doesn't support atomic increment in upsert)
  await supabase.rpc('increment_usage', {
    p_user_id: userId,
    p_feature: feature,
    p_year: year,
    p_month: month,
  })
}

async function getMonthlyUsage(userId: string, feature: string): Promise<number> {
  const supabase = getSupabaseAdmin()

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  const { data } = await supabase
    .from('usage')
    .select('count')
    .eq('user_id', userId)
    .eq('feature', feature)
    .eq('year', year)
    .eq('month', month)
    .single()

  return data?.count || 0
}

export async function setUserTier(userId: string, tier: 'free' | 'pro' | 'api'): Promise<void> {
  const supabase = getSupabaseAdmin()

  await supabase
    .from('entitlements')
    .upsert(
      {
        user_id: userId,
        tier,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
}
