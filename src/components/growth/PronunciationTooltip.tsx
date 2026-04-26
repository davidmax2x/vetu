'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { APP_NAME } from '@/lib/constants'

/**
 * PronunciationTooltip - Shows once on first visit
 * Displays pronunciation of Vêtu brand name
 */
export function PronunciationTooltip() {
  const [show, setShow] = useState(false)
  const STORAGE_KEY = 'vetu_pronunciation_shown'

  useEffect(() => {
    // Check if tooltip has been shown before
    const hasShown = localStorage.getItem(STORAGE_KEY)
    if (!hasShown) {
      setShow(true)
      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        setShow(false)
        localStorage.setItem(STORAGE_KEY, 'true')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setShow(false)
    localStorage.setItem(STORAGE_KEY, 'true')
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2"
        >
          <div className="relative rounded-xl bg-[#3A3D47] px-4 py-2 text-center">
            <button
              onClick={handleDismiss}
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0A0A0B] text-[#7A7D88] hover:text-[#F7F4EF]"
            >
              ×
            </button>
            <p className="font-serif text-sm italic text-[#F7F4EF]">
              /veh-too/ · French for &lsquo;dressed&rsquo;
            </p>
            {/* Arrow */}
            <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#3A3D47]" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
