export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export type EnergyNewsItem = {
  title: string
  link: string
  pubDate: string | null
  source: string
  image?: string | null
}

export type EnergyNewsResponse = {
  scope: 'id' | 'global' | 'both'
  lang: string
  country: string
  count: number
  items: EnergyNewsItem[]
}

export async function fetchEnergyNews(params?: {
  limit?: number
  scope?: 'id' | 'global' | 'both'
  lang?: string
  country?: string
  keywords?: string
}) {
  const qs = new URLSearchParams()
  if (params?.limit) qs.set('limit', String(params.limit))
  if (params?.scope) qs.set('scope', params.scope)
  if (params?.lang) qs.set('lang', params.lang)
  if (params?.country) qs.set('country', params.country)
  if (params?.keywords) qs.set('keywords', params.keywords)

  // IMPORTANT: backend mounted at /api/news
  const res = await fetch(`${API_URL}/api/news/energy?${qs.toString()}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to fetch news (${res.status})`)
  return (await res.json()) as EnergyNewsResponse
}
