import { AFFILIATE_PROGRAMMES } from '@/lib/constants'

export interface ShoppingLink {
  programme: string
  url: string
  commission: string
}

export function generateShoppingLinks(query: string): ShoppingLink[] {
  const encodedQuery = encodeURIComponent(query)
  const links: ShoppingLink[] = []

  Object.entries(AFFILIATE_PROGRAMMES).forEach(([name, config]) => {
    if (!config.baseUrl) return

    // Append tracking parameter if publisher ID env var is set
    const publisherId = process.env[`${name}_PUBLISHER_ID`]
    let url = `${config.baseUrl}${encodedQuery}`

    if (publisherId) {
      const separator = url.includes('?') ? '&' : '?'
      url += `${separator}pub=${publisherId}`
    }

    links.push({
      programme: name,
      url,
      commission: config.commission,
    })
  })

  return links
}

export function generateTrackedUrl(
  baseUrl: string,
  outfitId: string,
  userId?: string | null
): string {
  const separator = baseUrl.includes('?') ? '&' : '?'
  const params = new URLSearchParams()
  params.set('vetu_ref', outfitId)
  if (userId) {
    params.set('vetu_user', userId)
  }
  return `${baseUrl}${separator}${params.toString()}`
}
