import Replicate from 'replicate'
import { SDXL_MODEL, IDMVTON_MODEL, REPLICATE_TIMEOUT_MS, MAX_COST_PER_SESSION_GBP } from './constants'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

// Approximate cost per run in GBP (based on Replicate pricing as of 2026)
const COSTS_GBP: Record<string, number> = {
  [SDXL_MODEL]: 0.015,
  [IDMVTON_MODEL]: 0.04,
}

export interface RunResult {
  output: any
  cost: number
  durationMs: number
}

export async function runModel(
  modelId: string,
  input: Record<string, any>,
  timeoutMs = REPLICATE_TIMEOUT_MS
): Promise<RunResult> {
  const start = Date.now()

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const output = await replicate.run(modelId as any, {
      input,
      wait: { interval: 500, timeout: timeoutMs } as any,
    })

    clearTimeout(timeoutId)
    const durationMs = Date.now() - start
    const cost = COSTS_GBP[modelId] || 0.02

    return { output, cost, durationMs }
  } catch (error: any) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error(`Model ${modelId} timed out after ${timeoutMs}ms`)
    }
    throw error
  }
}

export async function generateGarmentImage(
  garmentPrompt: string,
  negativePrompt = 'model, person, human, face, hands, background clutter, text, watermark'
): Promise<{ imageUrl: string; cost: number }> {
  const result = await runModel(SDXL_MODEL, {
    prompt: `Product photography of a garment on a clean white background: ${garmentPrompt}. Professional studio lighting, flat lay or invisible mannequin style, no model, no person, no face, no hands.`,
    negative_prompt: negativePrompt,
    width: 768,
    height: 1024,
    num_inference_steps: 30,
    guidance_scale: 7.5,
    scheduler: 'K_EULER',
  })

  // SDXL returns an array of image URLs
  const imageUrl = Array.isArray(result.output) ? result.output[0] : result.output
  if (!imageUrl || typeof imageUrl !== 'string') {
    throw new Error('SDXL did not return a valid image URL')
  }

  return { imageUrl, cost: result.cost }
}

export async function runIdmVton(
  personImageBase64: string,
  garmentImageUrl: string,
  garmentDescription: string
): Promise<{ imageUrl: string; cost: number }> {
  const result = await runModel(IDMVTON_MODEL, {
    human_img: personImageBase64,
    garm_img: garmentImageUrl,
    garment_des: garmentDescription,
    category: 'upper_body',
    is_checked: true,
    is_checked_crop: false,
    denoise_steps: 30,
    seed: 42,
  })

  // IDM-VTON returns an image URL or array
  const imageUrl = Array.isArray(result.output) ? result.output[0] : result.output
  if (!imageUrl || typeof imageUrl !== 'string') {
    throw new Error('IDM-VTON did not return a valid image URL')
  }

  return { imageUrl, cost: result.cost }
}

export async function prewarmModel(modelId: string): Promise<void> {
  try {
    await replicate.predictions.create({
      model: modelId.split(':')[0] as any,
      version: modelId.split(':')[1] as any,
      input: { prompt: 'warmup' },
    })
  } catch {
    // Prewarm is best-effort; don't throw
  }
}

export function estimateTryOnCost(): number {
  return (COSTS_GBP[SDXL_MODEL] || 0.015) + (COSTS_GBP[IDMVTON_MODEL] || 0.04)
}

export function checkSessionBudget(currentSpend: number): { allowed: boolean; remaining: number } {
  const remaining = MAX_COST_PER_SESSION_GBP - currentSpend
  return { allowed: remaining >= estimateTryOnCost(), remaining }
}
