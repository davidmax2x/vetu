'use client'

import { useState } from 'react'
import { useStyleStore } from '@/store/useStyleStore'
import { referralSent } from '@/lib/analytics/events'

interface ReferralBadgeProps {
  code: string | null
  conversions: number
}

export function ReferralBadge({ code, conversions }: ReferralBadgeProps) {
  const [copied, setCopied] = useState(false)
  const referralUrl = code ? `https://vetu.ai/r/${code}` : null

  const handleCopy = async () => {
    if (!referralUrl) return

    try {
      await navigator.clipboard.writeText(referralUrl)
      setCopied(true)
      referralSent(code!)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!code) {
    return (
      <div className="rounded-xl border border-[#E0DBD2]/10 bg-[#0A0A0B]/50 p-4">
        <p className="text-sm text-[#7A7D88]">Loading referral code...</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[#E0DBD2]/10 bg-[#0A0A0B]/50 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-[#F7F4EF]">Invite a friend</h3>
          <p className="text-sm text-[#7A7D88]">You both get a free analysis</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[#C9A84C]">{conversions}</div>
          <div className="text-xs text-[#7A7D88]">friends joined</div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <div className="flex-1 rounded-lg bg-[#0A0A0B] px-3 py-2 font-mono text-sm text-[#F7F4EF]">
          {referralUrl}
        </div>
        <button
          onClick={handleCopy}
          className="rounded-lg bg-[#C9A84C] px-4 py-2 text-sm font-medium text-[#0A0A0B] transition-colors hover:bg-[#F0DFA0]"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
