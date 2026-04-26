import { getSupabaseAdmin } from './client'
import { Outfit } from '@/lib/outfitSchema'

export interface SavedOutfit {
  id: string
  user_id: string
  outfit_data: Outfit
  occasion: string
  season: string
  created_at: string
}

export async function saveOutfit(userId: string, outfit: Outfit): Promise<SavedOutfit | null> {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('saved_outfits')
    .insert({
      user_id: userId,
      outfit_data: outfit as any,
      occasion: outfit.occasion,
      season: outfit.colorSeason,
    })
    .select()
    .single()

  if (error) {
    console.error('[WARDROBE] saveOutfit error:', error)
    return null
  }

  return data as SavedOutfit
}

export async function getSavedOutfits(userId: string, limit = 50): Promise<SavedOutfit[]> {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('saved_outfits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[WARDROBE] getSavedOutfits error:', error)
    return []
  }

  return (data || []) as SavedOutfit[]
}

export async function deleteSavedOutfit(userId: string, outfitId: string): Promise<boolean> {
  const supabase = getSupabaseAdmin()

  const { error } = await supabase
    .from('saved_outfits')
    .delete()
    .eq('id', outfitId)
    .eq('user_id', userId)

  if (error) {
    console.error('[WARDROBE] deleteSavedOutfit error:', error)
    return false
  }

  return true
}

export async function getSavedOutfitById(userId: string, outfitId: string): Promise<SavedOutfit | null> {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('saved_outfits')
    .select('*')
    .eq('id', outfitId)
    .eq('user_id', userId)
    .single()

  if (error || !data) {
    return null
  }

  return data as SavedOutfit
}
