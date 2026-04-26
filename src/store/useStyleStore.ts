import { create } from 'zustand'

interface StyleStore {
  step: 'capture' | 'preferences' | 'humanInTheLoop' | 'analyzing' | 'results'
  setStep: (step: StyleStore['step']) => void

  photo: string | null
  photoForTryOn: string | null
  setPhoto: (photo: string) => void

  preferences: {
    gender: 'feminine' | 'masculine' | 'androgynous'
    occasion: string
    culturalContext: string
    bodyTypeNotes: string
  }
  setPreferences: (prefs: Partial<StyleStore['preferences']>) => void

  analysis: any
  setAnalysis: (analysis: any) => void
  manualOverrides: Record<string, any>
  applyManualOverride: (field: string, value: any) => void

  outfits: any[]
  outfitsLocked: number
  palette: any
  styleRecs: any
  tier: 'free' | 'pro'
  setRecommendations: (data: { outfits: any[], outfitsLocked?: number, palette: any, styleRecs: any, tier: 'free' | 'pro' }) => void

  tryOnImages: Record<string, any>
  setTryOnStatus: (outfitId: string, status: any) => void

  savedOutfits: any[]
  setSavedOutfits: (outfits: any[]) => void

  advisorOpen: boolean
  setAdvisorOpen: (open: boolean) => void

  estimatedCost: number
  incrementCost: (amount: number) => void

  errors: Record<string, string>
  setError: (key: string, error: string) => void
  clearError: (key: string) => void
}

export const useStyleStore = create<StyleStore>((set) => ({
  step: 'capture',
  setStep: (step) => set({ step }),

  photo: null,
  photoForTryOn: null,
  setPhoto: (photo) => set({ photo }),

  preferences: {
    gender: 'feminine',
    occasion: 'everyday casual',
    culturalContext: 'global-western',
    bodyTypeNotes: ''
  },
  setPreferences: (prefs) => set((state) => ({
    preferences: { ...state.preferences, ...prefs }
  })),

  analysis: null,
  setAnalysis: (analysis) => set({ analysis }),
  manualOverrides: {},
  applyManualOverride: (field, value) => set((state) => ({
    manualOverrides: { ...state.manualOverrides, [field]: value },
    analysis: state.analysis ? { ...state.analysis, [field]: value } : null
  })),

  outfits: [],
  outfitsLocked: 0,
  palette: null,
  styleRecs: null,
  tier: 'free',
  setRecommendations: ({ outfits, outfitsLocked = 0, palette, styleRecs, tier }) =>
    set({ outfits, outfitsLocked, palette, styleRecs, tier }),

  tryOnImages: {},
  setTryOnStatus: (outfitId, status) => set((state) => ({
    tryOnImages: { ...state.tryOnImages, [outfitId]: status }
  })),

  savedOutfits: [],
  setSavedOutfits: (savedOutfits) => set({ savedOutfits }),

  advisorOpen: false,
  setAdvisorOpen: (advisorOpen) => set({ advisorOpen }),

  estimatedCost: 0,
  incrementCost: (amount) => set((state) => ({
    estimatedCost: state.estimatedCost + amount
  })),

  errors: {},
  setError: (key, error) => set((state) => ({
    errors: { ...state.errors, [key]: error }
  })),
  clearError: (key) => set((state) => {
    const { [key]: _, ...rest } = state.errors
    return { errors: rest }
  })
}))
