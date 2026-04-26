import posthog from 'posthog-js'

/**
 * Initialize PostHog analytics
 * Only runs on client-side
 */
export function initAnalytics(): void {
  if (typeof window === 'undefined') {
    return
  }

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!apiKey) {
    console.warn('[Analytics] PostHog key not configured')
    return
  }

  posthog.init(apiKey, {
    api_host: 'https://eu.posthog.com',
    persistence: 'localStorage',
    autocapture: false,
    capture_pageview: false,
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') {
        console.debug('[Analytics] PostHog loaded')
      }
    },
  })
}

/**
 * Track an event with optional properties
 * Only runs on client-side
 */
export function track<T extends Record<string, unknown> = Record<string, unknown>>(
  event: string,
  properties?: T
): void {
  if (typeof window === 'undefined') {
    return
  }

  if (!posthog.__loaded) {
    console.warn('[Analytics] PostHog not initialized, event not tracked:', event)
    return
  }

  posthog.capture(event, properties)
}

/**
 * Identify a user with their ID and traits
 * Only runs on client-side
 */
export function identify(userId: string, traits?: Record<string, unknown>): void {
  if (typeof window === 'undefined') {
    return
  }

  if (!posthog.__loaded) {
    console.warn('[Analytics] PostHog not initialized, identify not called')
    return
  }

  posthog.identify(userId, traits)
}

/**
 * Reset the current user (sign out)
 * Only runs on client-side
 */
export function reset(): void {
  if (typeof window === 'undefined') {
    return
  }

  if (!posthog.__loaded) {
    console.warn('[Analytics] PostHog not initialized, reset not called')
    return
  }

  posthog.reset()
}

/**
 * Get the PostHog instance for advanced usage
 */
export function getPostHog(): typeof posthog | null {
  if (typeof window === 'undefined' || !posthog.__loaded) {
    return null
  }
  return posthog
}
