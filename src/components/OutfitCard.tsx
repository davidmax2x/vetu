'use client'

import { motion } from 'framer-motion'
import { Outfit } from '@/lib/outfitSchema'

interface OutfitCardProps {
  outfit: Outfit
  index: number
  locked?: boolean
  onTryOn?: (outfit: Outfit) => void
  onSave?: (outfit: Outfit) => void
}

export function OutfitCard({ outfit, index, locked = false, onTryOn, onSave }: OutfitCardProps) {
  if (locked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-paper)]/50 p-6 text-center"
      >
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[var(--color-paper)]/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="mb-2 text-2xl">🔒</div>
            <p className="text-sm font-medium text-[var(--color-muted)]">Upgrade to Pro</p>
            <p className="text-xs text-[var(--color-slate)]">Unlock all 4 outfits</p>
          </div>
        </div>
        <div className="opacity-20">
          <PlaceholderOutfit />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-paper)] p-6"
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="font-serif text-lg font-semibold text-[var(--color-ink)]">{outfit.name}</h3>
          <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">{outfit.occasion}</p>
        </div>
        <div className="flex gap-2">
          {onSave && (
            <button
              onClick={() => onSave(outfit)}
              className="rounded-full p-2 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-gold)]/10 hover:text-[var(--color-gold)]"
              aria-label="Save outfit"
            >
              <BookmarkIcon />
            </button>
          )}
          {onTryOn && (
            <button
              onClick={() => onTryOn(outfit)}
              className="rounded-full bg-[var(--color-gold)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink)] transition-opacity hover:opacity-90"
            >
              Try On
            </button>
          )}
        </div>
      </div>

      <p className="mb-4 text-sm text-[var(--color-slate)]">{outfit.description}</p>

      <div className="space-y-3">
        {outfit.items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg bg-[var(--color-paper)] p-3 ring-1 ring-[var(--color-border)]">
            <div className="flex gap-1">
              {item.suggestedColors.slice(0, 2).map((color, ci) => (
                <div
                  key={ci}
                  className="h-6 w-6 rounded-full border border-[var(--color-border)]"
                  style={{ backgroundColor: color }}
                  title={item.colorNames[ci] || color}
                />
              ))}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--color-ink)]">{item.name}</p>
              <p className="text-xs text-[var(--color-slate)]">{item.description}</p>
            </div>
            <span className="text-xs uppercase tracking-wide text-[var(--color-muted)]">{item.category}</span>
          </div>
        ))}
      </div>

      {outfit.styleNotes && (
        <div className="mt-4 rounded-lg bg-[var(--color-gold)]/5 p-3">
          <p className="text-xs leading-relaxed text-[var(--color-muted)]">{outfit.styleNotes}</p>
        </div>
      )}
    </motion.div>
  )
}

function PlaceholderOutfit() {
  return (
    <div className="space-y-3">
      <div className="h-5 w-1/2 rounded bg-[var(--color-border)]" />
      <div className="h-4 w-1/3 rounded bg-[var(--color-border)]" />
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-2">
            <div className="h-6 w-6 rounded-full bg-[var(--color-border)]" />
            <div className="h-4 w-3/4 rounded bg-[var(--color-border)]" />
          </div>
        ))}
      </div>
    </div>
  )
}

function BookmarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  )
}
