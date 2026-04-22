import sharp from 'sharp'

export async function preprocessForAnalysis(base64: string): Promise<string> {
  const buffer = Buffer.from(base64.split(',')[1] || base64, 'base64')
  const processed = await sharp(buffer)
    .resize(720, 720, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 85 })
    .toBuffer()
  return `data:image/jpeg;base64,${processed.toString('base64')}`
}

export async function preprocessForTryOn(base64: string): Promise<string> {
  const buffer = Buffer.from(base64.split(',')[1] || base64, 'base64')
  const processed = await sharp(buffer)
    .resize(768, 1024, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 90 })
    .toBuffer()
  return `data:image/jpeg;base64,${processed.toString('base64')}`
}

export async function stripExifData(base64: string): Promise<string> {
  const buffer = Buffer.from(base64.split(',')[1] || base64, 'base64')
  const processed = await sharp(buffer)
    .jpeg({ quality: 90 })
    .toBuffer()
  return `data:image/jpeg;base64,${processed.toString('base64')}`
}

export async function checkImageQuality(base64: string): Promise<{
  quality: 'good' | 'poor' | 'unusable'
  luminance: number
  reason?: string
}> {
  const buffer = Buffer.from(base64.split(',')[1] || base64, 'base64')
  const { data, info } = await sharp(buffer)
    .raw()
    .toBuffer({ resolveWithObject: true })

  let totalLuminance = 0
  const pixelCount = info.width * info.height

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const lum = 0.299 * r + 0.587 * g + 0.114 * b
    totalLuminance += lum
  }

  const avgLuminance = totalLuminance / pixelCount

  if (avgLuminance < 20) {
    return { quality: 'unusable', luminance: avgLuminance, reason: 'Image is too dark' }
  }
  if (avgLuminance > 240) {
    return { quality: 'unusable', luminance: avgLuminance, reason: 'Image is overexposed' }
  }
  if (avgLuminance < 50 || avgLuminance > 220) {
    return { quality: 'poor', luminance: avgLuminance, reason: 'Suboptimal lighting conditions' }
  }

  return { quality: 'good', luminance: avgLuminance }
}

export async function checkLiveFrame(imageData: ImageData): Promise<{
  ring: 'red' | 'amber' | 'green'
  message: string
}> {
  let totalLuminance = 0
  const pixelCount = imageData.width * imageData.height

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i]
    const g = imageData.data[i + 1]
    const b = imageData.data[i + 2]
    const lum = 0.299 * r + 0.587 * g + 0.114 * b
    totalLuminance += lum
  }

  const avgLuminance = totalLuminance / pixelCount

  if (avgLuminance < 50) {
    return { ring: 'red', message: 'Move to better light' }
  }
  if (avgLuminance < 100) {
    return { ring: 'amber', message: 'A little better — try facing a window' }
  }

  return { ring: 'green', message: 'Perfect — tap to capture' }
}
