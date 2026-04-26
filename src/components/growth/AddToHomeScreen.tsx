'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * AddToHomeScreen - PWA install prompt
 * Shows on mobile after season reveal
 */
export function AddToHomeScreen() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [show, setShow] = useState(false)
  const STORAGE_KEY = 'vetu_pwa_prompt_dismissed'

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (dismissed) return

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Only show on mobile (screen width <= 768)
      if (window.innerWidth <= 768) {
        setShow(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setShow(false)
    }
  }

  const handleDismiss = () => {
    setShow(false)
    localStorage.setItem(STORAGE_KEY, 'true')
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E0DBD2]/10 bg-[#0A0A0B] px-4 py-4"
        >
          <div className="mx-auto flex max-w-md items-center justify-between">
            <div>
              <p className="font-medium text-[#F7F4EF]">Install Vêtu</p>
              <p className="text-sm text-[#7A7D88]">Quick access — no App Store needed</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDismiss}
                className="rounded-lg px-4 py-2 text-sm text-[#7A7D88] transition-colors hover:text-[#F7F4EF]"
              >
                Not now
              </button>
              <button
                onClick={handleInstall}
                className="rounded-lg bg-[#C9A84C] px-4 py-2 text-sm font-medium text-[#0A0A0B] transition-colors hover:bg-[#F0DFA0]"
              >
                Install
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
