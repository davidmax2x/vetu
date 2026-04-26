import { getSupabaseAdmin } from '@/lib/db/client'
import { getAuthContext } from '@/lib/auth/session'

export interface UserDataExport {
  user: any
  savedOutfits: any[]
  feedback: any[]
  entitlements: any[]
  exportedAt: string
}

export async function exportUserData(userId: string): Promise<UserDataExport | null> {
  const supabase = getSupabaseAdmin()

  // Fetch user record
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  // Fetch saved outfits
  const { data: savedOutfits } = await supabase
    .from('saved_outfits')
    .select('*')
    .eq('user_id', userId)

  // Fetch feedback
  const { data: feedback } = await supabase
    .from('feedback')
    .select('*')
    .eq('user_id', userId)

  // Fetch entitlements
  const { data: entitlements } = await supabase
    .from('entitlements')
    .select('*')
    .eq('user_id', userId)

  return {
    user,
    savedOutfits: savedOutfits || [],
    feedback: feedback || [],
    entitlements: entitlements || [],
    exportedAt: new Date().toISOString(),
  }
}

export async function deleteUserData(userId: string): Promise<boolean> {
  const supabase = getSupabaseAdmin()

  // Delete feedback
  await supabase.from('feedback').delete().eq('user_id', userId)

  // Delete saved outfits
  await supabase.from('saved_outfits').delete().eq('user_id', userId)

  // Soft-delete user
  await supabase
    .from('users')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', userId)

  return true
}

export async function anonymizeUserData(userId: string): Promise<boolean> {
  const supabase = getSupabaseAdmin()

  // Anonymize user record instead of deleting
  await supabase
    .from('users')
    .update({
      email: `deleted-${userId}@anonymized.vetu.ai`,
      clerk_id: `anonymized-${userId}`,
      deleted_at: new Date().toISOString(),
    })
    .eq('id', userId)

  // Delete PII from feedback comments
  await supabase
    .from('feedback')
    .update({ comment: null })
    .eq('user_id', userId)

  return true
}
