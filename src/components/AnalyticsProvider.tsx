'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { initAnalytics, identify, reset } from '@/lib/analytics/posthog'
import { useStyleStore } from '@/store/useStyleStore'

/**
 * AnalyticsProvider - Initializes PostHog and manages user identification
 *
 * Wraps the app to provide analytics tracking. No visual output.
 *
 * Features:
 * - Initializes PostHog on mount
 * - Identifies user when they sign in
 * - Resets tracking on sign out
 * - Attaches user tier and color season to identity
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }): React.ReactNode {
  const { user, isSignedIn, isLoaded } = useUser()
  const { tier, analysis } = useStyleStore()

  // Initialize analytics on mount
  useEffect(() => {
    initAnalytics()
  }, [])

  // Handle user identification
  useEffect(() => {
    if (!isLoaded) {
      return
    }

    if (isSignedIn && user) {
      // Identify the user with their traits
      identify(user.id, {
        tier: tier?.toUpperCase() ?? 'FREE',
        colorSeason: analysis?.season ?? null,
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
      })
    } else if (!isSignedIn) {
      // Reset on sign out
      reset()
    }
  }, [isSignedIn, user, isLoaded, tier, analysis])

  return children
}
