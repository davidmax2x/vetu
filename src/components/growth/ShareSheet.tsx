'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { generateShareCard } from '@/lib/growth/shareCard'
import { shareCardCreated, shareCardShared } from '@/lib/analytics/events'

interface ShareSheetProps {
  isOpen: boolean
  onClose: () => void
  outfit: {
    outfitName: string
    colorSeason: string
    tryOnImageUrl?: string
  }
  isPro: boolean
}

export function ShareSheet({ isOpen, onClose, outfit, isPro }: ShareSheetProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleShare = async (platform: string) => {
    setIsGenerating(true)
    setError(null)

    try {
      // Generate card
      const cardUrl = await generateShareCard({
        colorSeason: outfit.colorSeason,
        outfitName: outfit.outfitName,
        tryOnImageUrl: outfit.tryOnImageUrl,
        isPro,
      })

      // Track share
      shareCardCreated(outfit.colorSeason, isPro)
      shareCardShared(platform)

      // Try native share first (mobile)
      if (navigator.share && platform === 'native') {
        const response = await fetch(cardUrl)
        const blob = await response.blob()
        const file = new File([blob], 'vetu-look.png', { type: 'image/png' })

        await navigator.share({
          title: `My ${outfit.colorSeason} look on Vêtu`,
          files: [file],
        })
      } else {
        // Fallback: copy link or download
        const link = document.createElement('a')
        link.href = cardUrl
        link.download = `vetu-${outfit.colorSeason.toLowerCase().replace(/\s+/g, '-')}.png`
        link.click()
      }

      onClose()
    } catch (err) {
      console.error('Share error:', err)
      setError('Failed to generate share card. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const platforms = [
    { id: 'native', name: 'Share...', icon: ShareIcon },
    { id: 'instagram', name: 'Instagram', icon: InstagramIcon },
    { id: 'tiktok', name: 'TikTok', icon: TikTokIcon },
    { id: 'copy', name: 'Copy Link', icon: LinkIcon },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t border-[#E0DBD2]/10 bg-[#0A0A0B] p-6"
          >
            <div className="mx-auto max-w-md">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold text-[#F7F4EF]">
                  Share your look
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-[#7A7D88] hover:bg-[#E0DBD2]/10"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" />
                  <p className="mt-4 text-sm text-[#7A7D88]">Creating your card...</p>
                </div>
              ) : error ? (
                <div className="py-8 text-center">
                  <p className="text-red-400">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-4 text-[#C9A84C] hover:underline"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => handleShare(platform.id)}
                      className="flex flex-col items-center gap-2 rounded-xl p-4 transition-colors hover:bg-[#E0DBD2]/5"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E0DBD2]/10">
                        <platform.icon className="h-6 w-6 text-[#F7F4EF]" />
                      </div>
                      <span className="text-xs text-[#7A7D88]">{platform.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {!isPro && (
                <p className="mt-6 text-center text-xs text-[#7A7D88]">
                  Free cards include a small Vêtu watermark.
                  <br />
                  Upgrade to Pro for watermark-free sharing.
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Icon components
function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.287.696.287 1.093m0-1.093l9.621-4.35m-9.621 4.35L15.99 6.15m-6.573 4.35a2.25 2.25 0 01-2.186-2.186m2.186 2.186L6.428 6.15m9.564 0a2.25 2.25 0 012.186 2.186m-2.186-2.186l4.35 9.621" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.525.02c1.8-.1 3.61.234 5.31.84 1.38.526 2.622 1.32 3.63 2.34 1.008 1.02 1.78 2.23 2.27 3.56.59 1.59.88 3.28.87 4.98v5.61c-.01.99-.11 1.98-.29 2.95-.18.97-.46 1.91-.83 2.8-.37.89-.83 1.73-1.37 2.5-.54.77-1.16 1.47-1.85 2.07-.69.6-1.44 1.11-2.25 1.51-.81.4-1.67.69-2.56.86-.89.17-1.8.24-2.71.2-1.41-.05-2.79-.32-4.1-.79-1.31-.47-2.51-1.14-3.55-1.98-1.04-.84-1.91-1.84-2.57-2.96-.66-1.12-1.1-2.36-1.3-3.65-.2-1.29-.15-2.61.14-3.88.29-1.27.83-2.46 1.58-3.51.75-1.05 1.69-1.94 2.77-2.62 1.08-.68 2.28-1.14 3.53-1.35.25-.04.5-.07.75-.08v5.61c-.25.02-.5.05-.74.1-.75.14-1.46.42-2.08.82-.62.4-1.14.91-1.53 1.51-.39.6-.65 1.28-.77 2-.12.72-.09 1.45.09 2.15.18.7.5 1.36.95 1.92.45.56 1.01 1.02 1.65 1.36.64.34 1.34.55 2.06.62.72.07 1.45-.02 2.14-.27.69-.25 1.32-.64 1.85-1.15.53-.51.95-1.12 1.23-1.79.28-.67.43-1.39.43-2.11V.02z" />
    </svg>
  )
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  )
}
