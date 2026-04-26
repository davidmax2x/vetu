import { getSupabaseAdmin } from './client'

export interface OutfitFeedback {
  id: string
  user_id: string
  outfit_id: string
  type: 'like' | 'dislike'
  comment?: string
  created_at: string
}

export async function submitFeedback(
  userId: string,
  outfitId: string,
  type: 'like' | 'dislike',
  comment?: string
): Promise<OutfitFeedback | null> {
  const supabase = getSupabaseAdmin()

  // Upsert: if feedback exists for this user+outfit, update it
  const { data, error } = await supabase
    .from('feedback')
    .upsert(
      {
        user_id: userId,
        outfit_id: outfitId,
        type,
        comment: comment || null,
      },
      { onConflict: 'user_id,outfit_id' }
    )
    .select()
    .single()

  if (error) {
    console.error('[FEEDBACK] submitFeedback error:', error)
    return null
  }

  return data as OutfitFeedback
}

export async function getFeedbackForOutfit(outfitId: string): Promise<{ likes: number; dislikes: number }> {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('feedback')
    .select('type')
    .eq('outfit_id', outfitId)

  if (error || !data) {
    return { likes: 0, dislikes: 0 }
  }

  const likes = data.filter((r: any) => r.type === 'like').length
  const dislikes = data.filter((r: any) => r.type === 'dislike').length

  return { likes, dislikes }
}

export async function getUserFeedback(userId: string): Promise<OutfitFeedback[]> {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[FEEDBACK] getUserFeedback error:', error)
    return []
  }

  return (data || []) as OutfitFeedback[]
}
