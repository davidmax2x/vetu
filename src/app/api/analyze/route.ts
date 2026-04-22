import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { auth } from '@clerk/nextjs/server'
import { getAuthContext } from '@/lib/auth/session'
import { checkEntitlement, incrementUsage } from '@/lib/billing/entitlements'
import { stripExifData, checkImageQuality, preprocessForAnalysis } from '@/lib/imagePreprocess'
import { CLAUDE_MODEL, MAX_COST_PER_SESSION_GBP } from '@/lib/constants'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: Request) {
  try {
    // Auth check (anonymous allowed)
    const authCtx = await getAuthContext()
    const userId = authCtx?.userId

    // Entitlement check
    if (userId) {
      const entitlement = await checkEntitlement(userId, 'analyse')
      if (!entitlement.allowed) {
        return NextResponse.json({
          error: 'ENTITLEMENT_DENIED',
          reason: entitlement.reason,
          upgradeUrl: entitlement.upgradeUrl
        }, { status: 429 })
      }
    }

    const { images } = await req.json()

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: 'NO_IMAGES' }, { status: 400 })
    }

    // Process all images: strip EXIF, check quality
    const processedImages = []
    for (const img of images) {
      const stripped = await stripExifData(img)
      const quality = await checkImageQuality(stripped)

      if (quality.quality === 'unusable') {
        return NextResponse.json({
          error: 'IMAGE_QUALITY',
          reason: quality.reason,
          luminance: quality.luminance
        }, { status: 400 })
      }

      const processed = await preprocessForAnalysis(stripped)
      processedImages.push(processed)
    }

    // Multi-shot: analyze all images and pick highest confidence
    let bestResult: any = null
    let bestConfidence = -1

    for (const img of processedImages) {
      const result = await analyzeImage(img)

      if (result.error) {
        return NextResponse.json(result, { status: 500 })
      }

      const confidenceScore = result.confidence === 'high' ? 3 : result.confidence === 'medium' ? 2 : 1
      if (confidenceScore > bestConfidence) {
        bestConfidence = confidenceScore
        bestResult = result
      }
    }

    // Increment usage
    if (userId) {
      await incrementUsage(userId, 'analyse')
    }

    return NextResponse.json(bestResult)

  } catch (error: any) {
    console.error('Analysis error:', error)
    return NextResponse.json({
      error: 'ANALYSIS_FAILED',
      message: error.message
    }, { status: 500 })
  }
}

async function analyzeImage(imageBase64: string): Promise<any> {
  const systemPrompt = `You are a certified professional color analyst trained in 12-season Sci/ART colour theory.
Analyse this person's photo and determine their seasonal colour profile based on
skin undertone, value, and chroma. Account for artificial lighting. If confidence
is low, still attempt the analysis but set confidence to "low". On deeper skin tones,
take extra care to distinguish warm deep from cool deep — this is a known difficulty
and it is better to express uncertainty than to misclassify. Never refuse to analyse.
Return your best assessment with a confidence score.

Return ONLY raw JSON with this exact structure:
{
  "skinUndertone": "warm|cool|neutral",
  "skinDepth": "fair|light|medium|tan|deep",
  "eyeColor": "string",
  "hairColor": "string",
  "faceShape": "oval|round|square|heart|oblong|diamond",
  "bodyProportions": {
    "shoulderToHip": "balanced|broad-shoulders|broad-hips|narrow",
    "torsoLength": "long|short|average",
    "notes": "string"
  },
  "colorSeason": "one of the 12 seasons",
  "seasonDescription": "2-3 sentences",
  "confidence": "high|medium|low",
  "analysisNotes": "string",
  "biasWarning": "string or null"
}`

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: [{
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/jpeg',
            data: imageBase64.split(',')[1] || imageBase64
          }
        }, {
          type: 'text',
          text: 'Analyse this person\'s seasonal colour profile. Return ONLY the JSON structure specified in your instructions.'
        }]
      }]
    })

    const content = response.content[0]
    let text = ''
    if (content.type === 'text') {
      text = content.text
    }

    // Try to extract JSON from response
    let result: any
    try {
      // Try direct parse first
      result = JSON.parse(text)
    } catch {
      // Try extracting JSON from markdown code blocks
      const jsonMatch = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1])
      } else {
        // Try extracting anything that looks like JSON
        const objMatch = text.match(/\{[\s\S]*\}/)
        if (objMatch) {
          result = JSON.parse(objMatch[0])
        } else {
          throw new Error('Could not parse JSON from response')
        }
      }
    }

    // Validate required fields
    const required = ['skinUndertone', 'skinDepth', 'colorSeason', 'confidence']
    for (const field of required) {
      if (!result[field]) {
        throw new Error(`Missing required field: ${field}`)
      }
    }

    result.manualOverrideAvailable = true
    return result

  } catch (error: any) {
    console.error('Claude analysis error:', error)

    // Retry once with simpler prompt
    try {
      const retryResponse = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 1024,
        system: 'Return ONLY raw JSON, no markdown, no explanations.',
        messages: [{
          role: 'user',
          content: [{
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: imageBase64.split(',')[1] || imageBase64
            }
          }, {
            type: 'text',
            text: 'Seasonal colour analysis JSON: skinUndertone, skinDepth, eyeColor, hairColor, faceShape, bodyProportions, colorSeason, seasonDescription, confidence, analysisNotes, biasWarning'
          }]
        }]
      })

      const retryContent = retryResponse.content[0]
      let retryText = ''
      if (retryContent.type === 'text') {
        retryText = retryContent.text
      }

      const result = JSON.parse(retryText)
      result.manualOverrideAvailable = true
      return result
    } catch (retryError: any) {
      return {
        error: 'ANALYSIS_FAILED',
        rawResponse: retryError.message
      }
    }
  }
}
