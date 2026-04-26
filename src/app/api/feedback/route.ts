import { NextResponse } from 'next/server'
import { getAuthContext } from '@/lib/auth/session'
import { submitFeedback, getFeedbackForOutfit, getUserFeedback } from '@/lib/db/feedback'

export async function POST(req: Request) {
  try {
    const authCtx = await getAuthContext()
    const userId = authCtx?.userId

    if (!userId) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    }

    const { outfitId, type, comment } = await req.json()

    if (!outfitId || !type || !['like', 'dislike'].includes(type)) {
      return NextResponse.json({ error: 'INVALID_FEEDBACK' }, { status: 400 })
    }

    const feedback = await submitFeedback(userId, outfitId, type, comment)

    if (!feedback) {
      return NextResponse.json({ error: 'SAVE_FAILED' }, { status: 500 })
    }

    return NextResponse.json({ success: true, feedback })
  } catch (error: any) {
    console.error('[FEEDBACK] POST error:', error)
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const authCtx = await getAuthContext()
    const userId = authCtx?.userId

    const { searchParams } = new URL(req.url)
    const outfitId = searchParams.get('outfitId')
    const userOnly = searchParams.get('user') === 'true'

    if (userOnly && userId) {
      const feedback = await getUserFeedback(userId)
      return NextResponse.json({ feedback })
    }

    if (outfitId) {
      const counts = await getFeedbackForOutfit(outfitId)
      return NextResponse.json({ outfitId, ...counts })
    }

    return NextResponse.json({ error: 'MISSING_PARAMS' }, { status: 400 })
  } catch (error: any) {
    console.error('[FEEDBACK] GET error:', error)
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 })
  }
}
