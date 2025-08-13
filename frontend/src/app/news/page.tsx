'use client'

import { useEffect, useMemo, useState } from 'react'
import { fetchEnergyNews, type EnergyNewsItem } from '@/lib/api'

export default function NewsPage() {
  const [items, setItems] = useState<EnergyNewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // filters
  const [scope, setScope] = useState<'id'|'global'|'both'>('id')
  const [limit, setLimit] = useState(15)
  const [lang, setLang] = useState('id')
  const [country, setCountry] = useState('ID')
  const [keywords, setKeywords] = useState('')
  const [quick, setQuick] = useState('') // local quick filter

  const load = async () => {
    setLoading(true); setError(null)
    try {
      const data = await fetchEnergyNews({ scope, limit, lang, country, keywords })
      setItems(data.items)
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load news')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, []) // initial fetch

  const filtered = useMemo(() => {
    const k = quick.trim().toLowerCase()
    if (!k) return items
    return items.filter(it =>
      (it.title ?? '').toLowerCase().includes(k) ||
      (it.source ?? '').toLowerCase().includes(k)
    )
  }, [items, quick])

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-brand-blue mb-6">Energy & Oil & Gas News</h1>

        <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6 grid md:grid-cols-6 gap-3 md:gap-4">
          <select className="px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                  value={scope} onChange={e=>setScope(e.target.value as any)}>
            <option value="id">Scope: Indonesia</option>
            <option value="global">Scope: Global</option>
            <option value="both">Scope: Both</option>
          </select>

          <select className="px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                  value={lang} onChange={e=>setLang(e.target.value)}>
            <option value="id">Lang: ID</option>
            <option value="en">Lang: EN</option>
          </select>

          <select className="px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                  value={country} onChange={e=>setCountry(e.target.value)}>
            <option value="ID">Country: ID</option>
            <option value="US">Country: US</option>
          </select>

          <select className="px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
                  value={limit} onChange={e=>setLimit(Number(e.target.value))}>
            {[10,15,20,30,50].map(n=>(
              <option key={n} value={n}>Limit: {n}</option>
            ))}
          </select>

          <input
            placeholder="Custom keywords (optional)"
            className="px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            value={keywords} onChange={e=>setKeywords(e.target.value)}
          />

          <button onClick={load}
                  className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-light disabled:opacity-60"
                  disabled={loading}>
            {loading ? 'Loading…' : 'Fetch News'}
          </button>

          <input
            placeholder="Quick filter by title/source…"
            className="md:col-span-3 px-3 py-2 border rounded-lg focus:outline-none focus:border-brand-blue"
            value={quick} onChange={e=>setQuick(e.target.value)}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((it, i) => (
            <article key={`${it.link}-${i}`} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col">
              {it.image ? (
                <a href={it.link} target="_blank" rel="noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.image} alt={it.title} className="w-full h-40 object-cover" />
                </a>
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <div className="p-4 flex-1 flex flex-col">
                <a href={it.link} target="_blank" rel="noreferrer" className="hover:underline">
                  <h3 className="text-lg font-semibold text-brand-blue line-clamp-3">{it.title}</h3>
                </a>
                <div className="mt-3 text-sm text-gray-600 flex items-center justify-between">
                  <span>{it.source || 'Source'}</span>
                  <time className="text-gray-500">{it.pubDate ? new Date(it.pubDate).toLocaleString() : ''}</time>
                </div>
              </div>

              <div className="p-4 pt-0">
                <a
                  href={it.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Read Article
                </a>
              </div>
            </article>
          ))}
        </div>

        {!loading && !error && filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No articles found.</p>
        )}
      </div>
    </div>
  )
}
