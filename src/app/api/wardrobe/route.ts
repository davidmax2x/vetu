import { NextResponse } from 'next/server'
import { getAuthContext } from '@/lib/auth/session'
import { checkEntitlement } from '@/lib/billing/entitlements'
import { saveOutfit, getSavedOutfits, deleteSavedOutfit, getSavedOutfitById } from '@/lib/db/wardrobe'

export async function POST(req: Request) {
  try {
    const authCtx = await getAuthContext()
    const userId = authCtx?.userId

    if (!userId) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    }

    // Entitlement check
    const entitlement = await checkEntitlement(userId, 'wardrobe')
    if (!entitlement.allowed) {
      return NextResponse.json({
        error: 'ENTITLEMENT_DENIED',
        reason: 'Wardrobe history is a Pro feature.',
        upgradeUrl: '/upgrade',
      }, { status: 429 })
    }

    const { outfit } = await req.json()

    if (!outfit || !outfit.id) {
      return NextResponse.json({ error: 'MISSING_OUTFIT' }, { status: 400 })
    }

    const saved = await saveOutfit(userId, outfit)

    if (!saved) {
      return NextResponse.json({ error: 'SAVE_FAILED' }, { status: 500 })
    }

    return NextResponse.json({ success: true, savedOutfit: saved })
  } catch (error: any) {
    console.error('[WARDROBE] POST error:', error)
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const authCtx = await getAuthContext()
    const userId = authCtx?.userId

    if (!userId) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const outfitId = searchParams.get('outfitId')

    if (outfitId) {
      const outfit = await getSavedOutfitById(userId, outfitId)
      return NextResponse.json({ outfit })
    }

    const outfits = await getSavedOutfits(userId, limit)
    return NextResponse.json({ outfits })
  } catch (error: any) {
    console.error('[WARDROBE] GET error:', error)
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const authCtx = await getAuthContext()
    const userId = authCtx?.userId

    if (!userId) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    }

    const { outfitId } = await req.json()

    if (!outfitId) {
      return NextResponse.json({ error: 'MISSING_OUTFIT_ID' }, { status: 400 })
    }

    const success = await deleteSavedOutfit(userId, outfitId)

    if (!success) {
      return NextResponse.json({ error: 'DELETE_FAILED' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[WARDROBE] DELETE error:', error)
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 })
  }
}
