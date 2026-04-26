import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/db/client'

export async function POST(req: Request) {
  try {
    const { outfitId, programme, userId, url } = await req.json()

    if (!outfitId || !programme || !url) {
      return NextResponse.json({ error: 'MISSING_FIELDS' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    const { error } = await supabase.from('affiliate_clicks').insert({
      outfit_id: outfitId,
      programme,
      user_id: userId || null,
      url,
      clicked_at: new Date().toISOString(),
    })

    if (error) {
      console.error('[AFFILIATE] Track error:', error)
      return NextResponse.json({ error: 'TRACK_FAILED' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[AFFILIATE] Unexpected error:', error)
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 })
  }
}
