import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Supabase environment variables not configured')
  }
  return createClient(url, key)
}

export interface AuthContext {
  userId: string | null
  clerkId: string | null
  email: string | null
  tier: 'free' | 'pro' | 'api'
}

export async function getAuthContext(): Promise<AuthContext> {
  const { userId } = await auth()

  if (!userId) {
    return { userId: null, clerkId: null, email: null, tier: 'free' }
  }

  const supabaseAdmin = getSupabaseAdmin()

  // Fetch user profile from Supabase
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, email, entitlements(tier)')
    .eq('clerk_id', userId)
    .single()

  const tier = user?.entitlements?.[0]?.tier || 'free'

  return {
    userId: user?.id || null,
    clerkId: userId,
    email: user?.email || null,
    tier,
  }
}
