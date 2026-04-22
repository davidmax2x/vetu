'use client'

import { useState, useCallback } from 'react'
import { useStyleStore } from '@/store/useStyleStore'

interface AnalysisResult {
  skinUndertone: string
  skinDepth: string
  eyeColor: string
  hairColor: string
  faceShape: string
  bodyProportions: {
    shoulderToHip: string
    torsoLength: string
    notes: string
  }
  colorSeason: string
  seasonDescription: string
  confidence: string
  analysisNotes: string
  biasWarning: string | null
  manualOverrideAvailable: boolean
}

export function useAnalysis() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const setAnalysis = useStyleStore((s) => s.setAnalysis)

  const analyze = useCallback(async (images: string[]) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      if (data.error) {
        throw new Error(data.error)
      }

      setResult(data)
      setAnalysis(data)
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [setAnalysis])

  return { analyze, loading, error, result }
}
