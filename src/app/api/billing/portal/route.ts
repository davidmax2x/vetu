import { NextResponse } from 'next/server'
import { getAuthContext } from '@/lib/auth/session'
import { createPortalSession, getOrCreateCustomer } from '@/lib/billing/stripe'

export async function POST(req: Request) {
  try {
    const authCtx = await getAuthContext()
    const userId = authCtx?.userId
    const email = authCtx?.email

    if (!userId || !email) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    }

    // Find or create Stripe customer
    const customerId = await getOrCreateCustomer(email, userId)

    const session = await createPortalSession(customerId)

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('[BILLING] Portal error:', error)
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 })
  }
}
