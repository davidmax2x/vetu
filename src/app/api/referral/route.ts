import { NextRequest, NextResponse } from 'next/server'
import { getAuthContext } from '@/lib/auth/session'
import {
  generateReferralCode,
  createReferral,
  processReferralConversion,
  getReferralStats,
} from '@/lib/growth/referral'

/**
 * GET /api/referral?code=xxx
 *
 * Returns referrer info for a referral code.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'code parameter required' },
        { status: 400 }
      )
    }

    // Get referral stats (this would include referrer name, etc)
    // For now, return basic info
    return NextResponse.json({
      code,
      referrer: {
        firstName: 'A Vêtu User',
      },
    })
  } catch (error) {
    console.error('Error fetching referral:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch referral' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/referral
 *
 * Creates a new referral code or processes a conversion.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    // Generate new referral code
    if (action === 'generate') {
      const authCtx = await getAuthContext()
      if (!authCtx?.userId) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Authentication required' },
          { status: 401 }
        )
      }

      const code = generateReferralCode(authCtx.userId)
      await createReferral(authCtx.userId, code)

      return NextResponse.json({
        success: true,
        code,
        referralUrl: `https://vetu.ai/r/${code}`,
      })
    }

    // Process referral conversion
    if (action === 'convert') {
      const { code, newUserId } = body

      if (!code || !newUserId) {
        return NextResponse.json(
          { error: 'Bad Request', message: 'code and newUserId required' },
          { status: 400 }
        )
      }

      await processReferralConversion(code, newUserId)

      return NextResponse.json({
        success: true,
        message: 'Referral conversion processed',
      })
    }

    return NextResponse.json(
      { error: 'Bad Request', message: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error processing referral:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to process referral' },
      { status: 500 }
    )
  }
}
