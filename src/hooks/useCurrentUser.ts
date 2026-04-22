'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

interface CurrentUser {
  userId: string | null
  email: string | null
  tier: 'free' | 'pro' | 'api'
  isLoaded: boolean
  isSignedIn: boolean
}

export function useCurrentUser(): CurrentUser {
  const { user, isLoaded, isSignedIn } = useUser()
  const [tier, setTier] = useState<'free' | 'pro' | 'api'>('free')

  useEffect(() => {
    if (!isSignedIn) {
      setTier('free')
      return
    }

    // Fetch tier from billing API
    fetch('/api/billing/usage')
      .then(res => res.json())
      .then(data => {
        if (data?.tier) setTier(data.tier)
      })
      .catch(() => setTier('free'))
  }, [isSignedIn])

  return {
    userId: user?.id || null,
    email: user?.primaryEmailAddress?.emailAddress || null,
    tier,
    isLoaded,
    isSignedIn: isSignedIn || false,
  }
}
