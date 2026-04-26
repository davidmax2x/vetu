import { NextResponse } from 'next/server'
import { getAuthContext } from '@/lib/auth/session'
import { checkEntitlement, incrementUsage } from '@/lib/billing/entitlements'
import { getAdvisorResponse } from '@/lib/advisor/engine'

export async function POST(req: Request) {
  try {
    const authCtx = await getAuthContext()
    const userId = authCtx?.userId

    if (!userId) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    }

    // Entitlement check
    const entitlement = await checkEntitlement(userId, 'advisor')
    if (!entitlement.allowed) {
      return NextResponse.json({
        error: 'ENTITLEMENT_DENIED',
        reason: entitlement.reason,
        upgradeUrl: entitlement.upgradeUrl,
      }, { status: 429 })
    }

    const { messages, context } = await req.json()

    if (!messages || !Array.isArray(messages) || !context) {
      return NextResponse.json({ error: 'MISSING_FIELDS' }, { status: 400 })
    }

    const result = await getAdvisorResponse(messages, context)

    // Increment usage
    await incrementUsage(userId, 'advisor_message')

    return NextResponse.json({
      response: result.response,
      usage: result.usage,
    })
  } catch (error: any) {
    console.error('[ADVISOR] Error:', error)
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 })
  }
}
