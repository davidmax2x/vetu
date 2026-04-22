'use client'

import { motion } from 'framer-motion'
import { getPalette } from '@/lib/colorPalettes'
import { ColorSwatch } from './ColorSwatch'

interface ColorPaletteProps {
  season: string
  showCulturalVariants?: boolean
  culturalContext?: string
}

export function ColorPalette({ season, showCulturalVariants, culturalContext }: ColorPaletteProps) {
  const palette = getPalette(season)

  const culturalColors = culturalContext && palette.culturalVariants[culturalContext as keyof typeof palette.culturalVariants]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
          palette.metallic === 'gold'
            ? 'bg-[#C9A84C]/20 text-[#F0DFA0]'
            : 'bg-slate-400/20 text-slate-300'
        }`}>
          {palette.metallic === 'gold' ? 'Gold jewellery' : 'Silver jewellery'}
        </span>
        <p className="text-sm text-[#7A7D88] italic">{palette.description}</p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="mb-3 text-sm font-medium text-[#F7F4EF]">Best colours</h4>
          <div className="flex flex-wrap gap-3">
            {palette.best.map((hex, i) => (
              <motion.div
                key={hex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <ColorSwatch hex={hex} name={palette.names.best[i]} />
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-medium text-[#F7F4EF]">Neutrals</h4>
          <div className="flex flex-wrap gap-3">
            {palette.neutral.map((hex, i) => (
              <motion.div
                key={hex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 + 0.3 }}
              >
                <ColorSwatch hex={hex} name={palette.names.neutral[i]} />
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-medium text-red-400">Avoid</h4>
          <div className="flex flex-wrap gap-3">
            {palette.avoid.map((hex, i) => (
              <motion.div
                key={hex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 + 0.6 }}
                className="relative"
              >
                <ColorSwatch hex={hex} name={palette.names.avoid[i]} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-0.5 w-8 rotate-45 bg-red-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {showCulturalVariants && culturalColors && culturalColors.length > 0 && (
          <div>
            <h4 className="mb-3 text-sm font-medium text-[#C9A84C]">
              Cultural additions ({culturalContext})
            </h4>
            <div className="flex flex-wrap gap-3">
              {culturalColors.map((hex, i) => (
                <motion.div
                  key={hex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 + 0.9 }}
                >
                  <ColorSwatch hex={hex} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
