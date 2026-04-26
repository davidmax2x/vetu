'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStyleStore } from '@/store/useStyleStore'
import { Outfit } from '@/lib/outfitSchema'

interface TryOnModalProps {
  outfit: Outfit
  isOpen: boolean
  onClose: () => void
}

export function TryOnModal({ outfit, isOpen, onClose }: TryOnModalProps) {
  const photoForTryOn = useStyleStore((s) => s.photoForTryOn)
  const incrementCost = useStyleStore((s) => s.incrementCost)
  const setTryOnStatus = useStyleStore((s) => s.setTryOnStatus)
  const existingStatus = useStyleStore((s) => s.tryOnImages[outfit.id])

  const [stage, setStage] = useState<'idle' | 'stage1' | 'stage2' | 'complete' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [garmentImage, setGarmentImage] = useState<string | null>(null)
  const [tryOnImage, setTryOnImage] = useState<string | null>(null)
  const [cost, setCost] = useState(0)

  const reset = () => {
    setStage('idle')
    setError(null)
    setGarmentImage(null)
    setTryOnImage(null)
    setCost(0)
  }

  const handleTryOn = async () => {
    if (!photoForTryOn) {
      setError('No photo available for try-on. Please capture a photo first.')
      setStage('error')
      return
    }

    reset()
    setStage('stage1')
    setTryOnStatus(outfit.id, { status: 'stage1', outfitId: outfit.id })

    try {
      // Build garment prompt from outfit items
      const garmentPrompt = outfit.items
        .filter((i) => ['Top', 'Dress', 'Bottom', 'Layer'].includes(i.category))
        .map((i) => `${i.description} in ${i.colorNames[0] || i.suggestedColors[0]}`)
        .join(', ')

      const garmentDescription = outfit.items
        .map((i) => i.description)
        .join('. ')

      const res = await fetch('/api/tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outfitId: outfit.id,
          garmentPrompt,
          garmentDescription,
          personImageBase64: photoForTryOn,
          estimatedCost: useStyleStore.getState().estimatedCost,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.reason || data.message || 'Try-on failed')
        setStage('error')
        setTryOnStatus(outfit.id, { status: 'error', error: data.reason })
        return
      }

      setGarmentImage(data.garmentImageUrl)
      setTryOnImage(data.tryOnImageUrl)
      setCost(data.totalCost)
      incrementCost(data.totalCost)
      setStage('complete')
      setTryOnStatus(outfit.id, {
        status: 'complete',
        garmentImageUrl: data.garmentImageUrl,
        tryOnImageUrl: data.tryOnImageUrl,
        cost: data.totalCost,
      })
    } catch (err: any) {
      setError(err.message || 'Network error')
      setStage('error')
      setTryOnStatus(outfit.id, { status: 'error', error: err.message })
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-paper)] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
              <div>
                <h2 className="font-serif text-lg font-semibold text-[var(--color-ink)]">Try On: {outfit.name}</h2>
                <p className="text-xs text-[var(--color-muted)]">{outfit.occasion}</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-border)]"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {stage === 'idle' && (
                <div className="text-center">
                  <p className="mb-4 text-sm text-[var(--color-slate)]">
                    We will generate a garment image and then show it on your photo using AI.
                  </p>
                  <p className="mb-6 text-xs text-[var(--color-muted)]">
                    Estimated cost: ~£0.06 · Max session budget: £0.80
                  </p>
                  <button
                    onClick={handleTryOn}
                    className="rounded-lg bg-[var(--color-gold)] px-6 py-3 text-sm font-medium text-[var(--color-ink)] transition-opacity hover:opacity-90"
                  >
                    Start Try-On
                  </button>
                </div>
              )}

              {(stage === 'stage1' || stage === 'stage2') && (
                <div className="text-center">
                  <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-gold)] border-t-transparent"></div>
                  <p className="text-sm font-medium text-[var(--color-ink)]">
                    {stage === 'stage1' ? 'Designing your garment...' : 'Fitting it on your photo...'}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    This usually takes 30–60 seconds.
                  </p>
                  <div className="mt-4 flex justify-center gap-2">
                    <StageDot active={stage === 'stage1'} label="Garment" />
                    <StageDot active={stage === 'stage2'} label="Fit" />
                  </div>
                </div>
              )}

              {stage === 'error' && (
                <div className="text-center">
                  <div className="mb-3 text-3xl">⚠️</div>
                  <p className="mb-1 text-sm font-medium text-red-400">Something went wrong</p>
                  <p className="mb-4 text-xs text-[var(--color-muted)]">{error}</p>
                  <button
                    onClick={handleTryOn}
                    className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-ink)] transition-colors hover:bg-[var(--color-border)]"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {stage === 'complete' && garmentImage && tryOnImage && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">Garment</p>
                      <img
                        src={garmentImage}
                        alt="Generated garment"
                        className="rounded-lg border border-[var(--color-border)]"
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">On You</p>
                      <img
                        src={tryOnImage}
                        alt="Virtual try-on"
                        className="rounded-lg border border-[var(--color-border)]"
                      />
                    </div>
                  </div>
                  <p className="text-center text-xs text-[var(--color-muted)]">
                    Cost: £{cost.toFixed(3)} · Session total: £{useStyleStore.getState().estimatedCost.toFixed(3)}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function StageDot({ active, label }: { active: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-2.5 w-2.5 rounded-full ${
          active ? 'bg-[var(--color-gold)]' : 'bg-[var(--color-border)]'
        }`}
      />
      <span className="text-xs text-[var(--color-muted)]">{label}</span>
    </div>
  )
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
