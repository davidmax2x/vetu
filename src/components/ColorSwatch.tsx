'use client'

import { useState } from 'react'

interface ColorSwatchProps {
  hex: string
  name?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ColorSwatch({ hex, name, size = 'md' }: ColorSwatchProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  }

  return (
    <div className="relative">
      <button
        className={`${sizeClasses[size]} rounded-full border-2 border-[#E0DBD2]/20 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]`}
        style={{ backgroundColor: hex }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => {
          navigator.clipboard.writeText(hex)
        }}
        aria-label={name || hex}
      />

      {showTooltip && (
        <div className="absolute -top-10 left-1/2 z-10 -translate-x-1/2 rounded-md bg-[#3A3D47] px-2 py-1 text-xs text-[#F7F4EF] shadow-lg whitespace-nowrap">
          {name ? `${name} · ${hex}` : hex}
        </div>
      )}
    </div>
  )
}
