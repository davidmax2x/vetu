import { toPng } from 'html-to-image'
import { SHARE_CARD_WATERMARK_TEXT, APP_NAME } from '@/lib/constants'

interface ShareCardOptions {
  colorSeason: string
  outfitName: string
  tryOnImageUrl?: string
  isPro: boolean
}

/**
 * Generate a branded share card PNG for social sharing.
 * Returns a base64-encoded PNG (1080×1920 for Stories).
 */
export async function generateShareCard(options: ShareCardOptions): Promise<string> {
  const { colorSeason, outfitName, tryOnImageUrl, isPro } = options

  // Create a hidden container for the card
  const container = document.createElement('div')
  container.style.width = '1080px'
  container.style.height = '1920px'
  container.style.backgroundColor = '#0A0A0B'
  container.style.display = 'flex'
  container.style.flexDirection = 'column'
  container.style.alignItems = 'center'
  container.style.justifyContent = 'center'
  container.style.padding = '80px'
  container.style.position = 'fixed'
  container.style.left = '-9999px'
  container.style.fontFamily = "'DM Sans', sans-serif"

  // Vêtu wordmark
  const wordmark = document.createElement('div')
  wordmark.textContent = APP_NAME
  wordmark.style.fontFamily = "'Cormorant Garamond', serif"
  wordmark.style.fontSize = '48px'
  wordmark.style.color = '#C9A84C'
  wordmark.style.marginBottom = '60px'
  wordmark.style.letterSpacing = '0.1em'
  container.appendChild(wordmark)

  // Season name (large)
  const seasonTitle = document.createElement('div')
  seasonTitle.textContent = colorSeason
  seasonTitle.style.fontFamily = "'Cormorant Garamond', serif"
  seasonTitle.style.fontSize = '120px'
  seasonTitle.style.fontWeight = '700'
  seasonTitle.style.color = '#F7F4EF'
  seasonTitle.style.textAlign = 'center'
  seasonTitle.style.marginBottom = '40px'
  seasonTitle.style.lineHeight = '1.1'
  container.appendChild(seasonTitle)

  // Outfit name
  const outfitTitle = document.createElement('div')
  outfitTitle.textContent = outfitName
  outfitTitle.style.fontSize = '48px'
  outfitTitle.style.color = '#7A7D88'
  outfitTitle.style.textAlign = 'center'
  outfitTitle.style.marginBottom = '80px'
  outfitTitle.style.maxWidth = '800px'
  container.appendChild(outfitTitle)

  // Try-on image (if available)
  if (tryOnImageUrl) {
    const imageWrapper = document.createElement('div')
    imageWrapper.style.width = '800px'
    imageWrapper.style.height = '1000px'
    imageWrapper.style.borderRadius = '24px'
    imageWrapper.style.overflow = 'hidden'
    imageWrapper.style.marginBottom = '60px'
    imageWrapper.style.backgroundColor = '#1a1a1c'

    const img = document.createElement('img')
    img.src = tryOnImageUrl
    img.style.width = '100%'
    img.style.height = '100%'
    img.style.objectFit = 'cover'
    imageWrapper.appendChild(img)
    container.appendChild(imageWrapper)
  }

  // Watermark (for free users)
  if (!isPro) {
    const watermark = document.createElement('div')
    watermark.textContent = SHARE_CARD_WATERMARK_TEXT
    watermark.style.fontSize = '32px'
    watermark.style.color = '#7A7D88'
    watermark.style.position = 'absolute'
    watermark.style.bottom = '60px'
    watermark.style.right = '60px'
    container.appendChild(watermark)
  }

  // Tagline
  const tagline = document.createElement('div')
  tagline.textContent = 'Dressed with intention.'
  tagline.style.fontSize = '36px'
  tagline.style.color = '#C9A84C'
  tagline.style.fontStyle = 'italic'
  tagline.style.marginTop = '40px'
  container.appendChild(tagline)

  document.body.appendChild(container)

  try {
    // Generate PNG
    const dataUrl = await toPng(container, {
      quality: 0.95,
      pixelRatio: 1,
    })

    return dataUrl
  } finally {
    document.body.removeChild(container)
  }
}

/**
 * Generate a square share card (1080×1080) for feed posts.
 */
export async function generateSquareShareCard(options: ShareCardOptions): Promise<string> {
  const { colorSeason, outfitName, tryOnImageUrl, isPro } = options

  const container = document.createElement('div')
  container.style.width = '1080px'
  container.style.height = '1080px'
  container.style.backgroundColor = '#0A0A0B'
  container.style.display = 'flex'
  container.style.flexDirection = 'column'
  container.style.alignItems = 'center'
  container.style.justifyContent = 'center'
  container.style.padding = '60px'
  container.style.position = 'fixed'
  container.style.left = '-9999px'
  container.style.fontFamily = "'DM Sans', sans-serif"

  // Vêtu wordmark
  const wordmark = document.createElement('div')
  wordmark.textContent = APP_NAME
  wordmark.style.fontFamily = "'Cormorant Garamond', serif"
  wordmark.style.fontSize = '36px'
  wordmark.style.color = '#C9A84C'
  wordmark.style.marginBottom = '40px'
  container.appendChild(wordmark)

  // Season name
  const seasonTitle = document.createElement('div')
  seasonTitle.textContent = colorSeason
  seasonTitle.style.fontFamily = "'Cormorant Garamond', serif"
  seasonTitle.style.fontSize = '80px'
  seasonTitle.style.fontWeight = '700'
  seasonTitle.style.color = '#F7F4EF'
  seasonTitle.style.textAlign = 'center'
  seasonTitle.style.marginBottom = '20px'
  container.appendChild(seasonTitle)

  // Outfit name
  const outfitTitle = document.createElement('div')
  outfitTitle.textContent = outfitName
  outfitTitle.style.fontSize = '32px'
  outfitTitle.style.color = '#7A7D88'
  outfitTitle.style.textAlign = 'center'
  outfitTitle.style.marginBottom = '40px'
  container.appendChild(outfitTitle)

  // Try-on image (smaller for square)
  if (tryOnImageUrl) {
    const imageWrapper = document.createElement('div')
    imageWrapper.style.width = '500px'
    imageWrapper.style.height = '500px'
    imageWrapper.style.borderRadius = '16px'
    imageWrapper.style.overflow = 'hidden'
    imageWrapper.style.backgroundColor = '#1a1a1c'

    const img = document.createElement('img')
    img.src = tryOnImageUrl
    img.style.width = '100%'
    img.style.height = '100%'
    img.style.objectFit = 'cover'
    imageWrapper.appendChild(img)
    container.appendChild(imageWrapper)
  }

  // Watermark
  if (!isPro) {
    const watermark = document.createElement('div')
    watermark.textContent = SHARE_CARD_WATERMARK_TEXT
    watermark.style.fontSize = '24px'
    watermark.style.color = '#7A7D88'
    watermark.style.position = 'absolute'
    watermark.style.bottom = '40px'
    watermark.style.right = '40px'
    container.appendChild(watermark)
  }

  document.body.appendChild(container)

  try {
    const dataUrl = await toPng(container, { quality: 0.95, pixelRatio: 1 })
    return dataUrl
  } finally {
    document.body.removeChild(container)
  }
}
