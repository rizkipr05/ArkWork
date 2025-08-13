import { Router, Request, Response } from 'express'
import rateLimit from 'express-rate-limit'
import Parser from 'rss-parser'
import pLimit from 'p-limit'
import { getPreviewImage } from '../utils/preview'

const router = Router()

// Rate limit
const limiter = rateLimit({ windowMs: 60 * 1000, max: 60 })
router.use(limiter)

// RSS Parser
const parser = new Parser({ headers: { 'User-Agent': 'arkwork-energy-news/1.0' } })

// Helper: Google News RSS URL
function gnewsUrl(query: string, lang = 'id', country = 'ID') {
  const base = 'https://news.google.com/rss/search'
  const p = new URLSearchParams({ q: query, hl: lang, gl: country, ceid: `${country}:${lang}` })
  return `${base}?${p.toString()}`
}

const ID_QUERIES = [
  '(migas OR minyak OR gas OR energi) site:esdm.go.id',
  '(migas OR minyak OR gas OR energi) site:katadata.co.id',
  '(migas OR minyak OR gas OR energi) site:cnbcindonesia.com',
  '(migas OR minyak OR gas OR energi) site:bisnis.com',
  '(migas OR minyak OR gas OR energi) site:cnnindonesia.com'
]

const GLOBAL_QUERIES = [
  '(oil OR gas OR LNG OR energy) site:reuters.com',
  '(oil OR gas OR LNG OR energy) site:aljazeera.com',
  '(oil OR gas OR LNG OR energy) site:bloomberg.com',
  '(oil OR gas OR LNG OR energy) site:ft.com',
  '(oil OR gas OR LNG OR energy) site:wsj.com'
]

// Root info (opsional)
router.get('/', (_req: Request, res: Response) => {
  res.json({
    ok: true,
    usage: '/api/news/energy?scope=id|global|both&limit=20&lang=id|en&country=ID|US&keywords=...'
  })
})

router.get('/energy', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(Number(req.query.limit ?? 20), 50)
    const scope = String(req.query.scope ?? 'both') // id | global | both
    const lang = String(req.query.lang ?? 'id')
    const country = String(req.query.country ?? 'ID')
    const customKeywords = (req.query.keywords ?? '').toString().trim()

    let queries: string[] = []
    if (scope === 'id') queries = ID_QUERIES
    else if (scope === 'global') queries = GLOBAL_QUERIES
    else queries = [...ID_QUERIES, ...GLOBAL_QUERIES]

    if (customKeywords) {
      queries = queries.map(() => customKeywords)
    }

    // fetch feeds with per-query try/catch
    const feeds = await Promise.all(
      queries.map(async (q) => {
        try {
          const feed = await parser.parseURL(gnewsUrl(q, lang, country))
          return (feed.items ?? []).map((it) => ({
            title: it.title ?? '',
            link: it.link ?? '',
            pubDate: it.pubDate ? new Date(it.pubDate).toISOString() : null,
            source: (it as any).source || it.creator || it.author || 'Google News'
          }))
        } catch {
          return []
        }
      })
    )

    const all = feeds.flat()

    // Deduplicate (normalize URL)
    const norm = (u?: string) => (u ?? '').replace(/#.*$/, '')
    const seen = new Set<string>()
    const deduped = all.filter((a) => {
      const key = norm(a.link) || a.title
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })

    // Sort by date desc
    deduped.sort((a, b) => (b.pubDate || '').localeCompare(a.pubDate || ''))

    // Fetch og:image with limited concurrency
    const limitRun = pLimit(5)
    const withImages = await Promise.all(
      deduped.slice(0, limit).map((item) =>
        limitRun(async () => {
          const image = item.link ? await getPreviewImage(item.link) : null
          return { ...item, image }
        })
      )
    )

    res.json({ scope, lang, country, count: withImages.length, items: withImages })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to fetch news' })
  }
})

export default router
