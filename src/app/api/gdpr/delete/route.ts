import { NextResponse } from 'next/server'
import { getAuthContext } from '@/lib/auth/session'
import { deleteUserData, anonymizeUserData } from '@/lib/security/gdpr'

export async function POST(req: Request) {
  try {
    const authCtx = await getAuthContext()
    const userId = authCtx?.userId

    if (!userId) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    }

    const { mode = 'delete' } = await req.json()

    if (mode === 'anonymize') {
      await anonymizeUserData(userId)
      return NextResponse.json({
        success: true,
        message: 'Your account has been anonymized. Your data is no longer personally identifiable.',
      })
    }

    await deleteUserData(userId)

    return NextResponse.json({
      success: true,
      message: 'Your account and associated data have been deleted.',
    })
  } catch (error: any) {
    console.error('[GDPR] Delete error:', error)
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 })
  }
}
