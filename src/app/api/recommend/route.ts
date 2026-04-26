import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getAuthContext } from '@/lib/auth/session'
import { checkEntitlement, incrementUsage } from '@/lib/billing/entitlements'
import { generateOutfits, OCCASIONS } from '@/lib/outfitSchema'
import { getBodyTypeAdvice } from '@/lib/bodyTypeAdvice'
import { getPalette } from '@/lib/colorPalettes'
import { getStyleRecommendations } from '@/lib/styleRecommendations'
import { getCulturalStyleNotes } from '@/lib/culturalContext'
import { CACHE_TTL_OUTFITS_SECONDS } from '@/lib/constants'

export async function POST(req: Request) {
  try {
    const authCtx = await getAuthContext()
    const userId = authCtx?.userId

    // Parse request
    const body = await req.json()
    const {
      season,
      faceShape,
      bodyProportions,
      gender,
      culturalContext,
      occasion,
      tier = 'free'
    } = body

    // Validate required fields
    if (!season || !occasion) {
      return NextResponse.json({ error: 'MISSING_FIELDS', message: 'season and occasion are required' }, { status: 400 })
    }

    if (!OCCASIONS.includes(occasion)) {
      return NextResponse.json({ error: 'INVALID_OCCASION', valid: OCCASIONS }, { status: 400 })
    }

    // Entitlement check
    if (userId) {
      const entitlement = await checkEntitlement(userId, 'outfit_recommendation')
      if (!entitlement.allowed) {
        return NextResponse.json({
          error: 'ENTITLEMENT_DENIED',
          reason: entitlement.reason,
          upgradeUrl: entitlement.upgradeUrl
        }, { status: 429 })
      }
    }

    // Get palette and style recommendations
    const palette = getPalette(season)
    const styleRecs = getStyleRecommendations(season, faceShape || 'oval', bodyProportions || {}, gender || 'feminine', culturalContext || 'global-western')
    const bodyAdvice = getBodyTypeAdvice(bodyProportions || {})
    const culturalNotes = getCulturalStyleNotes(culturalContext || 'global-western', season)

    // Generate outfits
    const outfitSet = generateOutfits(
      season,
      faceShape || 'oval',
      bodyProportions || {},
      gender || 'feminine',
      culturalContext || 'global-western',
      occasion,
      tier
    )

    // Increment usage if applicable
    if (userId) {
      await incrementUsage(userId, 'outfit_recommendation')
    }

    return NextResponse.json({
      outfits: outfitSet.outfits,
      locked: outfitSet.locked,
      shown: outfitSet.shown,
      tier: outfitSet.tier,
      palette: {
        best: palette.best,
        neutral: palette.neutral,
        avoid: palette.avoid,
        metallic: palette.metallic,
        description: palette.description
      },
      styleRecommendations: styleRecs,
      bodyTypeAdvice: bodyAdvice,
      culturalNotes,
      occasion
    }, {
      status: 200,
      headers: {
        'Cache-Control': `max-age=${CACHE_TTL_OUTFITS_SECONDS}`
      }
    })

  } catch (error: any) {
    console.error('[RECOMMEND]', error)
    return NextResponse.json({
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to generate recommendations'
    }, { status: 500 })
  }
}
