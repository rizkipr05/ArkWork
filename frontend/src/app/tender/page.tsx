'use client'

import { useEffect, useMemo, useState } from 'react'

/* ---------------- Types ---------------- */
type Tender = {
  id: number
  title: string
  buyer: string
  sector: 'Oil & Gas' | 'Renewable Energy' | 'Utilities' | 'Engineering'
  location: string
  status: 'Open' | 'Prequalification' | 'Closed'
  contract: 'EPC' | 'Supply' | 'Consulting' | 'Maintenance'
  budgetUSD: number
  deadline: string // YYYY-MM-DD
  teamSlots: number
  description: string
  documents?: string[]
}

/* ---------------- Seed data ---------------- */
const SEED: Tender[] = [
  { 
    id: 1, 
    title: 'EPC — Gas Compression Facility Upgrade', 
    buyer: 'Pertamina Hulu', 
    sector: 'Oil & Gas', 
    location: 'Riau', 
    status: 'Open', 
    contract: 'EPC', 
    budgetUSD: 7800000, 
    deadline: '2025-09-10', 
    teamSlots: 5, 
    description: 'Upgrade scope covers detail engineering, compressor & piping procurement, installation, pre‑commissioning and commissioning with full HSE compliance.',
    documents: ['RFP.pdf', 'BoQ.xlsx', 'Drawings.zip']
  },
  { 
    id: 2, 
    title: 'Supply — High‑Grade OCTG (Casing & Tubing)', 
    buyer: 'Borneo Energy', 
    sector: 'Oil & Gas', 
    location: 'Balikpapan', 
    status: 'Prequalification', 
    contract: 'Supply', 
    budgetUSD: 3200000, 
    deadline: '2025-08-02', 
    teamSlots: 10, 
    description: 'OCTG with API 5CT certification, full traceability, 3rd‑party inspection, and phased delivery to site.',
    documents: ['TechnicalSpec.pdf']
  },
  { 
    id: 3, 
    title: 'Consulting — Utility‑Scale Solar Feasibility Study', 
    buyer: 'Green Nusantara', 
    sector: 'Renewable Energy', 
    location: 'NTT', 
    status: 'Open', 
    contract: 'Consulting', 
    budgetUSD: 450000, 
    deadline: '2025-07-18', 
    teamSlots: 3, 
    description: '50 MWp solar feasibility: resource assessment, grid interconnection, permitting, E&S, financial model, and EPC structuring.'
  },
  { 
    id: 4, 
    title: 'Maintenance — Pipeline Corrosion Protection', 
    buyer: 'Jakarta Gas', 
    sector: 'Utilities', 
    location: 'Jakarta', 
    status: 'Open', 
    contract: 'Maintenance', 
    budgetUSD: 980000, 
    deadline: '2025-07-05', 
    teamSlots: 6, 
    description: 'Inspection and corrosion protection (CP & coating repair) for gas distribution pipelines, including emergency crew mobilization.'
  },
  { 
    id: 5, 
    title: 'EPC — Produced Water Treatment Package', 
    buyer: 'Energi Capital', 
    sector: 'Engineering', 
    location: 'South Sumatra', 
    status: 'Closed', 
    contract: 'EPC', 
    budgetUSD: 5400000, 
    deadline: '2025-04-28', 
    teamSlots: 4, 
    description: 'Design, fabricate and install PWTP (API, CPI, DAF, filtration) to meet discharge limits.'
  },
  { 
    id: 6, 
    title: 'Supply — Wind Turbine Components', 
    buyer: 'Renewable Indonesia', 
    sector: 'Renewable Energy', 
    location: 'Makassar', 
    status: 'Open', 
    contract: 'Supply', 
    budgetUSD: 12500000, 
    deadline: '2025-10-15', 
    teamSlots: 8, 
    description: 'Supply of nacelles, blades, towers and electrical components for 100MW wind farm project with installation support.',
    documents: ['WindSpec.pdf', 'SiteLayout.dwg']
  },
  { 
    id: 7, 
    title: 'Consulting — Environmental Impact Assessment', 
    buyer: 'EcoSphere Consultants', 
    sector: 'Engineering', 
    location: 'Bandung', 
    status: 'Prequalification', 
    contract: 'Consulting', 
    budgetUSD: 280000, 
    deadline: '2025-08-20', 
    teamSlots: 2, 
    description: 'Comprehensive EIA study for industrial complex including air quality, water resources, biodiversity and social impact analysis.'
  },
  { 
    id: 8, 
    title: 'EPC — Geothermal Power Plant', 
    buyer: 'Terra Energy', 
    sector: 'Renewable Energy', 
    location: 'West Java', 
    status: 'Open', 
    contract: 'EPC', 
    budgetUSD: 85000000, 
    deadline: '2025-11-30', 
    teamSlots: 12, 
    description: 'Design and construction of 55MW geothermal power plant including steam turbine, generator, cooling systems and grid connection.',
    documents: ['GeothermalRFP.pdf', 'GeologicalReport.pdf', 'Specifications.xlsx']
  }
]

/* ---------------- Page ---------------- */
export default function TendersPage() {
  const [tenders, setTenders] = useState<Tender[]>([])
  const [filters, setFilters] = useState({ q:'', loc:'', sector:'', status:'', contract:'' })
  const [selected, setSelected] = useState<Tender | null>(null)
  const [saved, setSaved] = useState<number[]>([])
  const [sort, setSort] = useState<'nearest'|'farthest'>('nearest')
  const [drawer, setDrawer] = useState(false)

  useEffect(() => {
    // Initialize with seed data since localStorage isn't available
    setTenders(SEED)
    setSaved([])
  }, [])

  const items = useMemo(() => {
    const k = filters.q.toLowerCase()
    const loc = filters.loc.toLowerCase()
    const arr = tenders.filter(t =>
      (k === ''   || t.title.toLowerCase().includes(k) || t.buyer.toLowerCase().includes(k)) &&
      (loc === '' || t.location.toLowerCase().includes(loc)) &&
      (filters.sector === '' || t.sector === filters.sector) &&
      (filters.status === '' || t.status === filters.status) &&
      (filters.contract === '' || t.contract === filters.contract)
    )
    arr.sort((a,b)=> sort==='nearest'
      ? new Date(a.deadline).getTime()-new Date(b.deadline).getTime()
      : new Date(b.deadline).getTime()-new Date(a.deadline).getTime()
    )
    return arr
  }, [tenders, filters, sort])

  const toggleSave = (id: number) => {
    const next = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id]
    setSaved(next)
  }
  const clearFilters = () => setFilters({ q:'', loc:'', sector:'', status:'', contract:'' })

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero / Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Browse Tenders</h1>
              <p className="text-neutral-600">Project & procurement opportunities for multi‑team collaboration.</p>
            </div>

            {/* Search + Sort */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  <SearchIcon className="h-4 w-4" />
                </span>
                <input
                  value={filters.q}
                  onChange={(e)=>setFilters(s=>({...s,q:e.target.value}))}
                  placeholder="Search title / buyer…"
                  className="w-full sm:w-80 rounded-xl border border-neutral-300 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-neutral-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-neutral-600">Sort</label>
                <select
                  value={sort}
                  onChange={(e)=>setSort(e.target.value as any)}
                  className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="nearest">Nearest deadline</option>
                  <option value="farthest">Farthest deadline</option>
                </select>
              </div>

              {/* Filter button (mobile) */}
              <button
                onClick={()=>setDrawer(true)}
                className="sm:hidden inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm"
              >
                <FilterIcon className="h-4 w-4" /> Filters
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Layout: sidebar + list + detail */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8 grid lg:grid-cols-12 gap-6">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:col-span-3 lg:block">
          <FilterCard>
            <FilterInput
              label="Location"
              value={filters.loc}
              onChange={(v)=>setFilters(s=>({...s,loc:v}))}
              icon={<PinIcon className="h-4 w-4" />}
            />
            <FilterSelect
              label="Sector"
              value={filters.sector}
              onChange={(v)=>setFilters(s=>({...s,sector:v}))}
              options={['','Oil & Gas','Renewable Energy','Utilities','Engineering']}
              icon={<LayersIcon className="h-4 w-4" />}
            />
            <FilterSelect
              label="Status"
              value={filters.status}
              onChange={(v)=>setFilters(s=>({...s,status:v}))}
              options={['','Open','Prequalification','Closed']}
              icon={<FlagIcon className="h-4 w-4" />}
            />
            <FilterSelect
              label="Contract"
              value={filters.contract}
              onChange={(v)=>setFilters(s=>({...s,contract:v}))}
              options={['','EPC','Supply','Consulting','Maintenance']}
              icon={<BriefcaseIcon className="h-4 w-4" />}
            />

            <div className="pt-3 flex items-center justify-between">
              <span className="text-sm text-neutral-500">{items.length} results</span>
              <button onClick={clearFilters} className="text-sm text-blue-700 hover:underline">Clear all</button>
            </div>
          </FilterCard>
        </aside>

        {/* List */}
        <section className="lg:col-span-6 space-y-4">
          {items.length === 0 ? (
            <EmptyState />
          ) : (
            items.map(tender => {
              const meta = buildDeadlineMeta(tender.deadline, tender.status)
              return (
                <article
                  key={tender.id}
                  className="group rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() => setSelected(tender)}
                >
                  <div className="flex gap-4">
                    <div className="h-12 w-12 shrink-0 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-amber-400 grid place-items-center text-white text-sm font-bold">
                      {initials(tender.buyer)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-base md:text-lg font-semibold text-neutral-900">
                            {tender.title}
                          </h3>
                          <p className="text-sm text-neutral-600 truncate">{tender.buyer}</p>
                        </div>
                        <button
                          onClick={(e)=>{ e.stopPropagation(); toggleSave(tender.id) }}
                          className={
                            saved.includes(tender.id)
                              ? 'rounded-lg border border-amber-500 bg-amber-50 text-amber-700 px-2.5 py-1 text-xs transition'
                              : 'rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 px-2.5 py-1 text-xs transition'
                          }
                        >
                          {saved.includes(tender.id) ? 'Saved' : 'Save'}
                        </button>
                      </div>

                      {/* meta row */}
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <Meta icon={<PinIcon className="h-4 w-4" />} text={tender.location} />
                        <Meta icon={<LayersIcon className="h-4 w-4" />} text={tender.sector} />
                        <Meta icon={<BriefcaseIcon className="h-4 w-4" />} text={tender.contract} />
                        <Meta icon={<FlagIcon className="h-4 w-4" />} text={tender.status} />
                      </div>

                      {/* budget / slots */}
                      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                        <InfoPill label="Budget" value={`$${formatMoney(tender.budgetUSD)}`} />
                        <InfoPill label="Team slots" value={`${tender.teamSlots} teams`} />
                      </div>

                      {/* deadline progress */}
                      <div className="mt-3">
                        <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${meta.color}`}
                            style={{ width: `${meta.progress}%` }}
                          />
                        </div>
                        <div className="mt-1 text-xs text-neutral-500">
                          {meta.progressText} • {formatDate(tender.deadline)}
                        </div>
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm text-neutral-600">{tender.description}</p>

                      <div className="mt-3 flex items-center justify-between">
                        <DocsList docs={tender.documents} />
                        <button
                          className="rounded-lg bg-neutral-900 text-white px-3 py-1.5 text-xs hover:opacity-90"
                          onClick={(e)=>{ e.stopPropagation(); setSelected(tender) }}
                        >
                          View details
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })
          )}
        </section>

        {/* Detail (desktop sticky) */}
        <aside className="hidden lg:col-span-3 lg:block">
          <DetailPanel
            tender={selected}
            onParticipate={() => participateSelected(selected)}
            onSave={() => selected && toggleSave(selected.id)}
            saved={selected ? saved.includes(selected.id) : false}
          />
        </aside>
      </div>

      {/* Drawer (mobile filters) */}
      {drawer && (
        <Drawer onClose={()=>setDrawer(false)} title="Filters">
          <div className="space-y-3">
            <FilterInput label="Location" value={filters.loc} onChange={(v)=>setFilters(s=>({...s,loc:v}))} icon={<PinIcon className="h-4 w-4" />} />
            <FilterSelect label="Sector" value={filters.sector} onChange={(v)=>setFilters(s=>({...s,sector:v}))} options={['','Oil & Gas','Renewable Energy','Utilities','Engineering']} icon={<LayersIcon className="h-4 w-4" />} />
            <FilterSelect label="Status" value={filters.status} onChange={(v)=>setFilters(s=>({...s,status:v}))} options={['','Open','Prequalification','Closed']} icon={<FlagIcon className="h-4 w-4" />} />
            <FilterSelect label="Contract" value={filters.contract} onChange={(v)=>setFilters(s=>({...s,contract:v}))} options={['','EPC','Supply','Consulting','Maintenance']} icon={<BriefcaseIcon className="h-4 w-4" />} />
            <div className="pt-2 flex items-center justify-between">
              <span className="text-sm text-neutral-500">{items.length} results</span>
              <button onClick={clearFilters} className="text-sm text-blue-700 hover:underline">Clear all</button>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  )

  function participateSelected(sel: Tender | null) {
    if (!sel) return
    alert(`Interested to participate: ${sel.title}\nPlease upload your documents in the next step.`)
  }
}

/* ---------------- UI helpers ---------------- */
function FilterCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 sticky top-24">
      <div className="mb-2 text-sm font-semibold text-neutral-900">Filters</div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}
function FilterInput({ label, value, onChange, icon }: { label:string; value:string; onChange:(v:string)=>void; icon?:React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wide text-neutral-500">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">{icon}</span>
        <input
          value={value}
          onChange={(e)=>onChange(e.target.value)}
          className="w-full rounded-xl border border-neutral-300 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-neutral-400"
          placeholder={`Filter ${label.toLowerCase()}…`}
        />
      </div>
    </label>
  )
}
function FilterSelect({
  label, value, onChange, options, icon,
}: { label:string; value:string; onChange:(v:string)=>void; options:string[]; icon?:React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wide text-neutral-500">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">{icon}</span>
        <select
          value={value}
          onChange={(e)=>onChange(e.target.value)}
          className="w-full rounded-xl border border-neutral-300 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-neutral-400"
        >
          {options.map(o => <option key={o || 'all'} value={o}>{o || `All ${label}`}</option>)}
        </select>
      </div>
    </label>
  )
}

function Meta({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1">
      <span className="text-neutral-600">{icon}</span>
      <span className="truncate">{text}</span>
    </div>
  )
}

function InfoPill({ label, value }: { label:string; value:string }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
      <div className="text-xs uppercase tracking-wide text-neutral-500">{label}</div>
      <div className="text-sm text-neutral-900">{value}</div>
    </div>
  )
}

function DocsList({ docs }: { docs?: string[] }) {
  if (!docs || docs.length === 0) return <span className="text-xs text-neutral-400">No documents</span>
  return (
    <div className="flex flex-wrap items-center gap-2">
      {docs.map(d => (
        <span
          key={d}
          className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs"
        >
          <PaperIcon className="h-3 w-3" /> {d}
        </span>
      ))}
    </div>
  )
}

function DetailPanel({
  tender, onParticipate, onSave, saved
}: { tender: Tender | null; onParticipate: () => void; onSave: () => void; saved: boolean }) {
  if (!tender) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
        Select a tender to see details
      </div>
    )
  }
  
  const meta = buildDeadlineMeta(tender.deadline, tender.status)
  
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sticky top-24">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-amber-400 grid place-items-center text-white text-sm font-bold">
          {initials(tender.buyer)}
        </div>
        <div>
          <h2 className="text-lg font-bold text-neutral-900">{tender.title}</h2>
          <p className="text-sm text-neutral-600">{tender.buyer} • {tender.location}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <Info label="Sector" value={tender.sector} />
        <Info label="Contract" value={tender.contract} />
        <Info label="Status" value={tender.status} />
        <Info label="Deadline" value={formatDate(tender.deadline)} />
        <Info label="Budget" value={`$${formatMoney(tender.budgetUSD)}`} />
        <Info label="Team slots" value={`${tender.teamSlots} teams`} />
      </div>

      <div className="mt-4">
        <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
          <div className={`h-full rounded-full ${meta.color}`} style={{ width: `${meta.progress}%` }} />
        </div>
        <div className="mt-1 text-xs text-neutral-500">{meta.progressText}</div>
      </div>

      <p className="mt-4 text-sm text-neutral-700">{tender.description}</p>

      {tender.documents && tender.documents.length > 0 && (
        <div className="mt-4">
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">Documents</div>
          <div className="flex flex-wrap gap-2">
            {tender.documents.map(d => (
              <span
                key={d}
                className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs"
              >
                <PaperIcon className="h-3 w-3" /> {d}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 space-y-2">
        <button onClick={onParticipate} className="w-full rounded-xl bg-neutral-900 px-4 py-2.5 text-white hover:opacity-90">Participate</button>
        <button onClick={onSave} className={`w-full rounded-xl px-4 py-2.5 ${saved ? 'bg-amber-500 text-white' : 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'}`}>
          {saved ? 'Saved' : 'Save Tender'}
        </button>
      </div>
    </div>
  )
}

function Info({ label, value }: { label:string; value:string }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
      <div className="text-xs uppercase tracking-wide text-neutral-500">{label}</div>
      <div className="text-sm text-neutral-900 break-words">{value}</div>
    </div>
  )
}

function Drawer({ children, onClose, title }:{children:React.ReactNode; onClose:()=>void; title:string}) {
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-[85%] max-w-xs bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-3 h-12">
          <div className="text-sm font-semibold">{title}</div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg border border-neutral-200">
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="p-3 space-y-3">{children}</div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center">
      <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-neutral-100 grid place-items-center">
        <SearchIcon className="h-6 w-6 text-neutral-600" />
      </div>
      <h3 className="font-semibold text-neutral-900">No tenders found</h3>
      <p className="mt-1 text-sm text-neutral-600">Try adjusting filters or keywords.</p>
    </div>
  )
}

/* ---------------- Icons ---------------- */
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" {...props}><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
}
function PinIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" {...props}><path d="M12 22s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="2"/></svg>
}
function LayersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" fill="none" {...props}><path d="M12 3l8 4-8 4-8-4 8-4z" stroke="currentColor" strokeWidth="2" /><path d="M4 11l8 4 8-4" stroke="currentColor" strokeWidth="2" /><path d="M4 15l8 4 8-4" stroke="currentColor" strokeWidth="2" /></svg>)
}
function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" fill="none" {...props}><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" /><path d="M3 12h18" stroke="currentColor" strokeWidth="2" /></svg>)
}
function FlagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" fill="none" {...props}><path d="M5 4v16M6 4h11l-2 4h-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>)
}
function PaperIcon(props: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" fill="none" {...props}><path d="M14 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V7l-5-5Z" stroke="currentColor" strokeWidth="2" /><path d="M14 2v5h5M9 13h6M9 17h4M9 9h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>)
}
function FilterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" fill="none" {...props}><path d="M4 6h16M6 12h12M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>)
}
function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (<svg viewBox="0 0 24 24" fill="none" {...props}><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>)
}

/* ---------------- Utils ---------------- */
function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0,2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function formatMoney(n: number) {
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

function formatDate(s: string) {
  try {
    return new Date(s + 'T00:00:00').toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return s
  }
}

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

function buildDeadlineMeta(deadline: string, status: Tender['status']) {
  const end = new Date(deadline + 'T00:00:00')
  const now = new Date()
  const total = 60 // normalize window
  const left = Math.max(0, daysBetween(now, end))
  const progress = Math.max(0, Math.min(100, 100 - (left / total) * 100))
  const isClosed = status === 'Closed' || end.getTime() < now.getTime()
  const color = isClosed ? 'bg-rose-500' : left <= 7 ? 'bg-amber-500' : 'bg-emerald-500'
  const progressText = isClosed
    ? 'Submissions closed'
    : left <= 0
    ? 'Due today'
    : `${left} day${left > 1 ? 's' : ''} left`
  return { progress, progressText, color }
}