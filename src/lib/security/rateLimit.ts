import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

// General API rate limit: 20 requests per 10 seconds per IP
export const generalLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '10s'),
  analytics: true,
  prefix: 'ratelimit:general',
})

// Analysis rate limit: 5 per minute per user
export const analysisLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1m'),
  analytics: true,
  prefix: 'ratelimit:analysis',
})

// Try-on rate limit: 10 per hour per user
export const tryonLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1h'),
  analytics: true,
  prefix: 'ratelimit:tryon',
})

// Advisor rate limit: 30 per hour per user
export const advisorLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '1h'),
  analytics: true,
  prefix: 'ratelimit:advisor',
})

export async function checkRateLimit(
  identifier: string,
  limiter: Ratelimit
): Promise<{ allowed: boolean; limit: number; remaining: number; reset: number }> {
  const { success, limit, remaining, reset } = await limiter.limit(identifier)
  return {
    allowed: success,
    limit,
    remaining,
    reset,
  }
}

export function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return 'unknown'
}
