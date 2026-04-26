import { NextResponse } from 'next/server'
import { getAuthContext } from '@/lib/auth/session'
import { createCheckoutSession, getOrCreateCustomer } from '@/lib/billing/stripe'
import { PRICING } from '@/lib/constants'

export async function POST(req: Request) {
  try {
    const authCtx = await getAuthContext()
    const userId = authCtx?.userId
    const email = authCtx?.email

    if (!userId || !email) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    }

    const { plan } = await req.json()

    let priceId: string
    switch (plan) {
      case 'pro_monthly':
        priceId = process.env.STRIPE_PRO_MONTHLY_PRICE_ID!
        break
      case 'pro_annual':
        priceId = process.env.STRIPE_PRO_ANNUAL_PRICE_ID!
        break
      case 'api_starter':
        priceId = process.env.STRIPE_API_STARTER_PRICE_ID!
        break
      case 'api_growth':
        priceId = process.env.STRIPE_API_GROWTH_PRICE_ID!
        break
      case 'api_scale':
        priceId = process.env.STRIPE_API_SCALE_PRICE_ID!
        break
      default:
        return NextResponse.json({ error: 'INVALID_PLAN' }, { status: 400 })
    }

    if (!priceId) {
      return NextResponse.json({ error: 'PRICE_NOT_CONFIGURED' }, { status: 500 })
    }

    const session = await createCheckoutSession(userId, email, priceId)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error: any) {
    console.error('[BILLING] Subscribe error:', error)
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 })
  }
}
