'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useStyleStore } from '@/store/useStyleStore'
import { PhotoCapture } from './PhotoCapture'
import { ColorPalette } from './ColorPalette'
import { OutfitCard } from './OutfitCard'
import { AdvisorChat } from './advisor/Chat'
import { UpgradeModal } from './billing/UpgradeModal'
import { TryOnModal } from './TryOnModal'
import { useState, useEffect } from 'react'

export function StepFlow() {
  const step = useStyleStore((s) => s.step)
  const analysis = useStyleStore((s) => s.analysis)
  const outfits = useStyleStore((s) => s.outfits)
  const outfitsLocked = useStyleStore((s) => s.outfitsLocked)
  const palette = useStyleStore((s) => s.palette)
  const styleRecs = useStyleStore((s) => s.styleRecs)
  const setStep = useStyleStore((s) => s.setStep)
  const setPreferences = useStyleStore((s) => s.setPreferences)
  const setPhoto = useStyleStore((s) => s.setPhoto)
  const setAnalysis = useStyleStore((s) => s.setAnalysis)
  const setRecommendations = useStyleStore((s) => s.setRecommendations)
  const photo = useStyleStore((s) => s.photo)
  const preferences = useStyleStore((s) => s.preferences)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState('')
  const [tryOnOutfit, setTryOnOutfit] = useState<any>(null)
  const [showAdvisor, setShowAdvisor] = useState(false)

  // Run analysis + recommendations when entering analyzing step
  useEffect(() => {
    if (step !== 'analyzing') return

    let cancelled = false

    const run = async () => {
      try {
        // Step 1: Analyze photo
        const images = photo ? [photo] : []
        const analyzeRes = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ images })
        })
        const analysisData = await analyzeRes.json()
        if (!analyzeRes.ok) throw new Error(analysisData.error || 'Analysis failed')
        if (!cancelled) setAnalysis(analysisData)

        // Step 2: Get recommendations
        const recommendRes = await fetch('/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            season: analysisData.colorSeason,
            faceShape: analysisData.faceShape,
            bodyProportions: analysisData.bodyProportions,
            gender: preferences.gender,
            culturalContext: preferences.culturalContext,
            occasion: preferences.occasion,
            tier: 'free'
          })
        })
        const recommendData = await recommendRes.json()
        if (!recommendRes.ok) throw new Error(recommendData.error || 'Recommendations failed')

        if (!cancelled) {
          setRecommendations({
            outfits: recommendData.outfits,
            outfitsLocked: recommendData.locked,
            palette: recommendData.palette,
            styleRecs: recommendData.styleRecommendations,
            tier: recommendData.tier
          })
          setStep('results')
        }
      } catch (err: any) {
        console.error('[STEP_FLOW]', err)
        if (!cancelled) setStep('capture')
      }
    }

    run()
    return () => { cancelled = true }
  }, [step, photo, preferences, setAnalysis, setRecommendations, setStep])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {['capture', 'preferences', 'analyzing', 'results'].map((s, i) => {
          const steps = ['capture', 'preferences', 'analyzing', 'results']
          const currentIndex = steps.indexOf(step)
          const isActive = i <= currentIndex
          return (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  isActive ? 'bg-[var(--color-gold)]' : 'bg-[var(--color-border)]'
                }`}
              />
              {i < 3 && (
                <div
                  className={`h-0.5 w-8 transition-colors ${
                    i < currentIndex ? 'bg-[var(--color-gold)]' : 'bg-[var(--color-border)]'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {step === 'capture' && (
          <motion.div
            key="capture"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-6 text-center">
              <h1 className="font-serif text-3xl font-semibold text-[var(--color-ink)]">
                Discover Your Colours
              </h1>
              <p className="mt-2 text-[var(--color-muted)]">
                Take a photo and we'll reveal your perfect palette.
              </p>
            </div>
            <PhotoCapture
              onCapture={(photos) => {
                if (photos[0]) setPhoto(photos[0])
                setStep('preferences')
              }}
            />
          </motion.div>
        )}

        {step === 'preferences' && (
          <motion.div
            key="preferences"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mx-auto max-w-md"
          >
            <h2 className="mb-6 text-center font-serif text-2xl font-semibold text-[var(--color-ink)]">
              Tell us about you
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-ink)]">Gender presentation</label>
                <select
                  value={preferences.gender}
                  onChange={(e) => setPreferences({ gender: e.target.value as any })}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)]"
                >
                  <option value="feminine">Feminine</option>
                  <option value="masculine">Masculine</option>
                  <option value="androgynous">Androgynous</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-ink)]">Occasion</label>
                <select
                  value={preferences.occasion}
                  onChange={(e) => setPreferences({ occasion: e.target.value })}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)]"
                >
                  <option value="everyday casual">Everyday Casual</option>
                  <option value="work professional">Work Professional</option>
                  <option value="evening formal">Evening Formal</option>
                  <option value="wedding guest">Wedding Guest</option>
                  <option value="date night">Date Night</option>
                  <option value="weekend brunch">Weekend Brunch</option>
                  <option value="beach resort">Beach Resort</option>
                  <option value="business casual">Business Casual</option>
                  <option value="cocktail party">Cocktail Party</option>
                  <option value="black tie">Black Tie</option>
                  <option value="festival">Festival</option>
                  <option value="travel">Travel</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-ink)]">Cultural context</label>
                <select
                  value={preferences.culturalContext}
                  onChange={(e) => setPreferences({ culturalContext: e.target.value })}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)]"
                >
                  <option value="global-western">Global Western</option>
                  <option value="south-asian">South Asian</option>
                  <option value="west-african">West African</option>
                  <option value="east-asian">East Asian</option>
                  <option value="middle-eastern">Middle Eastern</option>
                  <option value="latin-american">Latin American</option>
                </select>
              </div>

              <button
                onClick={() => setStep('analyzing')}
                className="w-full rounded-lg bg-[var(--color-gold)] py-3 text-sm font-medium text-[var(--color-ink)] transition-opacity hover:opacity-90"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {step === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="mb-6 inline-block h-12 w-12 animate-spin rounded-full border-2 border-[var(--color-gold)] border-t-transparent"></div>
            <p className="text-lg font-medium text-[var(--color-ink)]">Analysing your photo...</p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">This takes about 10–20 seconds</p>
          </motion.div>
        )}

        {step === 'results' && analysis && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Season reveal */}
            <div className="text-center">
              <p className="text-sm uppercase tracking-wide text-[var(--color-muted)]">Your colour season</p>
              <h1 className="font-serif text-4xl font-semibold text-[var(--color-ink)]">
                {analysis.colorSeason}
              </h1>
              <p className="mt-2 text-[var(--color-slate)]">{analysis.seasonDescription}</p>
              {analysis.biasWarning && (
                <p className="mt-2 text-xs text-amber-400">{analysis.biasWarning}</p>
              )}
            </div>

            {/* Palette */}
            {palette && <ColorPalette season={analysis.colorSeason} showCulturalVariants />}

            {/* Body type advice */}
            {styleRecs?.bodyTypeAdvice && (
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-paper)] p-6">
                <h3 className="mb-3 font-serif text-lg font-semibold text-[var(--color-ink)]">
                  Your Body Shape: {styleRecs.bodyTypeAdvice.bodyShape}
                </h3>
                <p className="mb-4 text-sm text-[var(--color-slate)]">{styleRecs.bodyTypeAdvice.silhouetteGoal}</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">Fit Advice</p>
                    <ul className="space-y-1">
                      {styleRecs.bodyTypeAdvice.fitAdvice.map((tip: string, i: number) => (
                        <li key={i} className="text-sm text-[var(--color-slate)]">{tip}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">Recommended Shapes</p>
                    <div className="flex flex-wrap gap-2">
                      {styleRecs.bodyTypeAdvice.recommendedShapes.map((shape: string, i: number) => (
                        <span
                          key={i}
                          className="rounded-full bg-[var(--color-gold)]/10 px-3 py-1 text-xs text-[var(--color-gold)]"
                        >
                          {shape}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Outfits */}
            {outfits && outfits.length > 0 && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-serif text-2xl font-semibold text-[var(--color-ink)]">Recommended Outfits</h2>
                  <button
                    onClick={() => setShowAdvisor(true)}
                    className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-ink)] transition-colors hover:bg-[var(--color-border)]"
                  >
                    Ask Aria
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {outfits.map((outfit: any, i: number) => (
                    <OutfitCard
                      key={outfit.id}
                      outfit={outfit}
                      index={i}
                      locked={i >= outfitsLocked}
                      onTryOn={(o) => {
                        setTryOnOutfit(o)
                      }}
                      onSave={(o) => {
                        fetch('/api/wardrobe', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ outfit: o }),
                        })
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Advisor panel */}
            {showAdvisor && (
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-paper)] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-serif text-lg font-semibold text-[var(--color-ink)]">Ask Aria</h3>
                  <button
                    onClick={() => setShowAdvisor(false)}
                    className="text-sm text-[var(--color-muted)]">
                    Close
                  </button>
                </div>
                <AdvisorChat
                  context={{
                    season: analysis.colorSeason,
                    faceShape: analysis.faceShape,
                    bodyProportions: analysis.bodyProportions,
                    gender: preferences.gender,
                    culturalContext: preferences.culturalContext,
                  }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        reason={upgradeReason}
      />

      <TryOnModal
        outfit={tryOnOutfit}
        isOpen={!!tryOnOutfit}
        onClose={() => setTryOnOutfit(null)}
      />
    </div>
  )
}
