import { NextResponse } from 'next/server'
import { getAuthContext } from '@/lib/auth/session'
import { checkEntitlement, incrementUsage } from '@/lib/billing/entitlements'
import {
  generateGarmentImage,
  runIdmVton,
  estimateTryOnCost,
  checkSessionBudget,
  prewarmModel,
} from '@/lib/replicate'
import { SDXL_MODEL, IDMVTON_MODEL, PREWARM_ON_OUTFIT_VIEW } from '@/lib/constants'

export async function POST(req: Request) {
  try {
    const authCtx = await getAuthContext()
    const userId = authCtx?.userId

    // Parse request
    const body = await req.json()
    const {
      outfitId,
      garmentPrompt,
      garmentDescription,
      personImageBase64,
      estimatedCost = 0,
    } = body

    if (!outfitId || !garmentPrompt || !personImageBase64) {
      return NextResponse.json(
        { error: 'MISSING_FIELDS', message: 'outfitId, garmentPrompt, and personImageBase64 are required' },
        { status: 400 }
      )
    }

    // Entitlement check
    if (userId) {
      const entitlement = await checkEntitlement(userId, 'tryon')
      if (!entitlement.allowed || !entitlement.tier || entitlement.tier === 'free') {
        return NextResponse.json(
          {
            error: 'ENTITLEMENT_DENIED',
            reason: 'Try-on is a Pro feature. Upgrade to unlock virtual try-on.',
            upgradeUrl: '/upgrade',
          },
          { status: 429 }
        )
      }
    }

    // Cost guardrail
    const budget = checkSessionBudget(estimatedCost)
    if (!budget.allowed) {
      return NextResponse.json(
        {
          error: 'BUDGET_EXCEEDED',
          reason: `Session cost would exceed £${(estimatedCost + estimateTryOnCost()).toFixed(2)}. Max per session is £0.80.`,
        },
        { status: 429 }
      )
    }

    // Stage 1: Generate garment image
    let garmentImageUrl: string
    let stage1Cost: number
    try {
      const result = await generateGarmentImage(garmentPrompt)
      garmentImageUrl = result.imageUrl
      stage1Cost = result.cost
    } catch (error: any) {
      console.error('[TRYON] Stage 1 failed:', error)
      return NextResponse.json(
        { error: 'STAGE1_FAILED', stage: 'garment_generation', message: error.message },
        { status: 500 }
      )
    }

    // Stage 2: IDM-VTON try-on
    let tryOnImageUrl: string
    let stage2Cost: number
    try {
      const result = await runIdmVton(
        personImageBase64,
        garmentImageUrl,
        garmentDescription || garmentPrompt
      )
      tryOnImageUrl = result.imageUrl
      stage2Cost = result.cost
    } catch (error: any) {
      console.error('[TRYON] Stage 2 failed:', error)
      return NextResponse.json(
        { error: 'STAGE2_FAILED', stage: 'virtual_tryon', message: error.message },
        { status: 500 }
      )
    }

    // Increment usage
    if (userId) {
      await incrementUsage(userId, 'tryon')
    }

    const totalCost = stage1Cost + stage2Cost

    return NextResponse.json({
      outfitId,
      garmentImageUrl,
      tryOnImageUrl,
      totalCost,
      stage1Cost,
      stage2Cost,
      status: 'complete',
    })

  } catch (error: any) {
    console.error('[TRYON] Unexpected error:', error)
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: error.message || 'Try-on pipeline failed' },
      { status: 500 }
    )
  }
}

// Prewarm endpoint for when outfit cards load
export async function PUT(req: Request) {
  try {
    if (!PREWARM_ON_OUTFIT_VIEW) {
      return NextResponse.json({ prewarmed: false, reason: 'PREWARM_ON_OUTFIT_VIEW is false' })
    }

    // Prewarm both models in parallel
    await Promise.all([
      prewarmModel(SDXL_MODEL),
      prewarmModel(IDMVTON_MODEL),
    ])

    return NextResponse.json({ prewarmed: true })
  } catch (error: any) {
    console.error('[TRYON] Prewarm failed:', error)
    return NextResponse.json({ prewarmed: false, error: error.message })
  }
}
