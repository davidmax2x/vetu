import { NextRequest, NextResponse } from 'next/server'
import { getAuthContext } from '@/lib/auth/session'
import { checkEntitlement } from '@/lib/billing/entitlements'
import { generateShareCard, generateSquareShareCard } from '@/lib/growth/shareCard'
import { getReferralStats } from '@/lib/growth/referral'

/**
 * POST /api/share/card
 *
 * Generates a share card PNG for social sharing.
 * Requires authentication.
 */
export async function POST(request: NextRequest) {
  try {
    // Check auth
    const authCtx = await getAuthContext()
    if (!authCtx?.userId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse request
    const body = await request.json()
    const { colorSeason, outfitName, tryOnImageUrl, format = 'story' } = body

    if (!colorSeason || !outfitName) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'colorSeason and outfitName required' },
        { status: 400 }
      )
    }

    // Check user tier
    const entitlement = await checkEntitlement(authCtx.userId, 'share')
    const isPro = entitlement.tier === 'pro' || entitlement.tier === 'api'

    // Generate card (server-side generation would require Puppeteer/playwright)
    // For now, return configuration that client will use
    // In production, you'd generate the PNG server-side

    // Get referral code
    const stats = await getReferralStats(authCtx.userId)
    const referralCode = stats.code || `ref-${authCtx.userId.slice(0, 8)}`
    const referralUrl = `https://vetu.ai/r/${referralCode}`

    return NextResponse.json({
      success: true,
      cardConfig: {
        colorSeason,
        outfitName,
        tryOnImageUrl,
        isPro,
        format,
      },
      referralUrl,
      referralCode,
      // Client should call generateShareCard() from @/lib/growth/shareCard
    })
  } catch (error) {
    console.error('Error generating share card:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to generate share card' },
      { status: 500 }
    )
  }
}
