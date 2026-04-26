'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { PRICING } from '@/lib/constants'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  reason?: string
}

export function UpgradeModal({ isOpen, onClose, reason }: UpgradeModalProps) {
  const { email } = useCurrentUser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')

  const handleUpgrade = async () => {
    setLoading(true)
    setError(null)

    try {
      const plan = billingPeriod === 'monthly' ? 'pro_monthly' : 'pro_annual'

      const res = await fetch('/api/billing/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Checkout failed')
        return
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (err: any) {
      setError(err.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  const monthlyPrice = PRICING.PRO_MONTHLY
  const annualPrice = PRICING.PRO_ANNUAL
  const annualMonthlyEquivalent = annualPrice / 12
  const annualSavings = ((monthlyPrice - annualMonthlyEquivalent) / monthlyPrice * 100).toFixed(0)

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
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-paper)] shadow-2xl"
          >
            {/* Header */}
            <div className="border-b border-[var(--color-border)] px-6 py-5">
              <h2 className="font-serif text-xl font-semibold text-[var(--color-ink)]">Unlock Vêtu Pro</h2>
              {reason && (
                <p className="mt-1 text-sm text-[var(--color-muted)]">{reason}</p>
              )}
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Billing toggle */}
              <div className="mb-6 flex rounded-lg border border-[var(--color-border)] p-1">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                    billingPeriod === 'monthly'
                      ? 'bg-[var(--color-gold)] text-[var(--color-ink)]'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod('annual')}
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                    billingPeriod === 'annual'
                      ? 'bg-[var(--color-gold)] text-[var(--color-ink)]'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
                  }`}
                >
                  Annual
                  <span className="ml-1.5 rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
                    Save {annualSavings}%
                  </span>
                </button>
              </div>

              {/* Price */}
              <div className="mb-6 text-center">
                <span className="font-serif text-4xl font-semibold text-[var(--color-ink)]">
                  £{billingPeriod === 'monthly' ? monthlyPrice : annualPrice}
                </span>
                <span className="text-[var(--color-muted)]">
                  {billingPeriod === 'monthly' ? '/month' : '/year'}
                </span>
              </div>

              {/* Features */}
              <ul className="mb-6 space-y-3">
                {[
                  'Unlimited colour analyses',
                  'Virtual try-on (2-stage AI pipeline)',
                  'Unlimited advisor chat',
                  'Save outfits to wardrobe',
                  'PDF export of your palette',
                  'Priority support',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-[var(--color-slate)]">
                    <CheckIcon />
                    {feature}
                  </li>
                ))}
              </ul>

              {error && (
                <p className="mb-4 text-center text-sm text-red-400">{error}</p>
              )}

              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full rounded-lg bg-[var(--color-gold)] py-3 text-sm font-medium text-[var(--color-ink)] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Upgrade to Pro'}
              </button>

              <p className="mt-4 text-center text-xs text-[var(--color-muted)]">
                Cancel anytime. No hidden fees.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-gold)]">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
