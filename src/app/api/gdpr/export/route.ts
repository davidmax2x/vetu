import { NextResponse } from 'next/server'
import { getAuthContext } from '@/lib/auth/session'
import { exportUserData } from '@/lib/security/gdpr'

export async function GET(req: Request) {
  try {
    const authCtx = await getAuthContext()
    const userId = authCtx?.userId

    if (!userId) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    }

    const data = await exportUserData(userId)

    if (!data) {
      return NextResponse.json({ error: 'EXPORT_FAILED' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Your data export is ready. Download and review within 30 days.',
    })
  } catch (error: any) {
    console.error('[GDPR] Export error:', error)
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 })
  }
}
