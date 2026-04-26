import Anthropic from '@anthropic-ai/sdk'
import { CLAUDE_MODEL, ADVISOR_NAME, ADVISOR_CONTEXT_WINDOW, ADVISOR_MAX_TOKENS } from '@/lib/constants'
import { getPalette } from '@/lib/colorPalettes'
import { getStyleRecommendations } from '@/lib/styleRecommendations'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface AdvisorMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AdvisorContext {
  season: string
  faceShape: string
  bodyProportions: any
  gender: string
  culturalContext: string
  recentOutfits?: any[]
}

export async function getAdvisorResponse(
  messages: AdvisorMessage[],
  context: AdvisorContext
): Promise<{ response: string; usage?: any }> {
  const palette = getPalette(context.season)
  const styleRecs = getStyleRecommendations(
    context.season,
    context.faceShape,
    context.bodyProportions,
    context.gender,
    context.culturalContext
  )

  const systemPrompt = buildAdvisorSystemPrompt(context, palette, styleRecs)

  // Only send last N messages to stay within context window
  const recentMessages = messages.slice(-ADVISOR_CONTEXT_WINDOW)

  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: ADVISOR_MAX_TOKENS,
    system: systemPrompt,
    messages: recentMessages.map((m) => ({
      role: m.role,
      content: m.content,
    })) as any,
  })

  const content = response.content[0]
  const text = content.type === 'text' ? content.text : 'Sorry, I could not process that.'

  return {
    response: text,
    usage: response.usage,
  }
}

function buildAdvisorSystemPrompt(
  context: AdvisorContext,
  palette: any,
  styleRecs: any
): string {
  return `You are ${ADVISOR_NAME}, a personal AI style advisor for Vêtu — a colour and style analysis platform.

USER PROFILE:
- Colour season: ${context.season}
- Face shape: ${context.faceShape}
- Gender presentation: ${context.gender}
- Cultural context: ${context.culturalContext}
- Best colours: ${palette.best.slice(0, 5).join(', ')}
- Metallic: ${palette.metallic}
- Recommended fabrics: ${styleRecs.fabrics.join(', ')}
- Patterns to wear: ${styleRecs.patterns.join(', ')}
- Patterns to avoid: ${styleRecs.avoidPatterns.join(', ')}

PERSONALITY:
- Warm, encouraging, and knowledgeable
- Specific and actionable — never vague
- Reference their palette colours by name when possible
- Keep responses concise (under ${ADVISOR_MAX_TOKENS} tokens)
- If you don't know something, say so honestly
- Never make up colour names that aren't in their palette

CURRENT DATE: 2026-04-23`
}
