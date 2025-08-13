'use client'

import { useEffect, useMemo, useState } from 'react'

type Job = {
  id: number
  title: string
  location: string
  industry: 'Oil & Gas' | 'Renewable Energy' | 'Mining'
  contract: 'Full-time' | 'Contract' | 'Part-time'
  function: 'Engineering' | 'Operations' | 'Management'
  remote: 'On-site' | 'Remote' | 'Hybrid'
  posted: string
  description: string
  company?: string
}

const SEED: Job[] = [
  { id:1, title:'Senior Petroleum Engineer', location:'Jakarta', industry:'Oil & Gas', contract:'Full-time', function:'Engineering', remote:'On-site', posted:'2024-01-15', description:'Lead subsurface planning, reservoir optimization, and well performance improvement in a multi-discipline team.', company: 'Pertamina EP' },
  { id:2, title:'Project Manager - Renewable Energy', location:'Surabaya', industry:'Renewable Energy', contract:'Contract', function:'Management', remote:'Hybrid', posted:'2024-01-14', description:'Manage utility-scale solar/wind projects, stakeholders, budget, and HSE compliance.', company: 'Green Nusantara' },
  { id:3, title:'Operations Supervisor', location:'Balikpapan', industry:'Oil & Gas', contract:'Full-time', function:'Operations', remote:'On-site', posted:'2024-01-13', description:'Oversee daily production activities, coordinate maintenance, and ensure safe operations.', company: 'Borneo Energy' },
  { id:4, title:'Mining Engineer', location:'Bandung', industry:'Mining', contract:'Full-time', function:'Engineering', remote:'On-site', posted:'2024-01-12', description:'Design mine plans, optimize extraction schedule, and supervise field execution.', company: 'Terra Minerals' },
  { id:5, title:'Environmental Consultant', location:'Jakarta', industry:'Oil & Gas', contract:'Contract', function:'Engineering', remote:'Remote', posted:'2024-01-11', description:'Conduct impact assessments, compliance advisory, and mitigation strategy for energy projects.', company: 'EcoSphere' },
  { id:6, title:'Solar Panel Technician', location:'Bali', industry:'Renewable Energy', contract:'Part-time', function:'Operations', remote:'On-site', posted:'2024-01-10', description:'Install, test, and maintain rooftop PV with QA/QC and safety standards.', company: 'Sinar Surya' },
  { id:7, title:'Drilling Engineer', location:'Pekanbaru', industry:'Oil & Gas', contract:'Full-time', function:'Engineering', remote:'On-site', posted:'2024-01-09', description:'Plan well programs, optimize drilling parameters, and coordinate service companies.', company: 'Riau Drilling' },
  { id:8, title:'Energy Analyst', location:'Jakarta', industry:'Renewable Energy', contract:'Full-time', function:'Management', remote:'Hybrid', posted:'2024-01-08', description:'Analyze market trends, build financial models, and support investment decisions.', company: 'Energi Capital' },
]

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filters, setFilters] = useState({ q:'', loc:'', industry:'', contract:'', func:'', remote:'' })
  const [selected, setSelected] = useState<Job | null>(null)
  const [saved, setSaved] = useState<number[]>([])
  const [sort, setSort] = useState<'newest'|'oldest'>('newest')
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('ark_jobs') ?? 'null')
    if (!stored) localStorage.setItem('ark_jobs', JSON.stringify(SEED))
    setJobs(stored ?? SEED)

    const s = JSON.parse(localStorage.getItem('ark_saved_global') ?? '[]')
    setSaved(s)
  }, [])

  const filtered = useMemo(() => {
    const k = filters.q.toLowerCase()
    const loc = filters.loc.toLowerCase()
    const arr = jobs.filter(j =>
      (k === '' || j.title.toLowerCase().includes(k) || j.company?.toLowerCase().includes(k)) &&
      (loc === '' || j.location.toLowerCase().includes(loc)) &&
      (filters.industry === '' || j.industry === filters.industry) &&
      (filters.contract === '' || j.contract === filters.contract) &&
      (filters.func === '' || j.function === filters.func) &&
      (filters.remote === '' || j.remote === filters.remote)
    )
    return arr.sort((a,b)=> sort==='newest'
      ? new Date(b.posted).getTime()-new Date(a.posted).getTime()
      : new Date(a.posted).getTime()-new Date(b.posted).getTime()
    )
  }, [jobs, filters, sort])

  const toggleSave = (id: number) => {
    const next = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id]
    setSaved(next)
    localStorage.setItem('ark_saved_global', JSON.stringify(next))
  }

  const clearFilters = () => setFilters({ q:'', loc:'', industry:'', contract:'', func:'', remote:'' })

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Page header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">Find Your Next Role</h1>
              <p className="text-neutral-600">Curated jobs across Oil & Gas, Renewables, and Mining.</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-neutral-600">Sort</label>
              <select
                value={sort}
                onChange={(e)=>setSort(e.target.value as any)}
                className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="border-b border-neutral-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-20 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
            <Input
              placeholder="Keyword (role/company)…"
              value={filters.q}
              onChange={(v)=>setFilters(s=>({...s,q:v}))}
              icon={<SearchIcon className="h-4 w-4" />}
            />
            <Input
              placeholder="Location…"
              value={filters.loc}
              onChange={(v)=>setFilters(s=>({...s,loc:v}))}
              icon={<PinIcon className="h-4 w-4" />}
            />
            <Select
              value={filters.industry}
              onChange={(v)=>setFilters(s=>({...s,industry:v}))}
              options={['','Oil & Gas','Renewable Energy','Mining']}
              label="Industry"
            />
            <Select
              value={filters.contract}
              onChange={(v)=>setFilters(s=>({...s,contract:v}))}
              options={['','Full-time','Contract','Part-time']}
              label="Contract"
            />
            <Select
              value={filters.func}
              onChange={(v)=>setFilters(s=>({...s,func:v}))}
              options={['','Engineering','Operations','Management']}
              label="Function"
            />
            <Select
              value={filters.remote}
              onChange={(v)=>setFilters(s=>({...s,remote:v}))}
              options={['','On-site','Remote','Hybrid']}
              label="Work mode"
            />
          </div>

          {/* Active filters bar */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm text-neutral-500">{filtered.length} results</span>
            {Object.entries(filters).map(([k, v]) =>
              v ? <Chip key={k} onClear={() => setFilters(s => ({ ...s, [k]: '' }))}>{labelize(k)}: {v}</Chip> : null
            )}
            {Object.values(filters).some(Boolean) && (
              <button onClick={clearFilters} className="text-sm text-blue-700 hover:underline ml-1">
                Clear all
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              {filtered.map(job => (
                <article
                  key={job.id}
                  className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() => {
                    setSelected(job)
                    setMobileDetailOpen(true)
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-amber-400 grid place-items-center text-white font-bold">
                      {initials(job.company || 'AW')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base md:text-lg font-semibold text-neutral-900 truncate">
                          {job.title}
                        </h3>
                        <button
                          onClick={(e)=>{ e.stopPropagation(); toggleSave(job.id) }}
                          aria-label="Save job"
                          className={[
                            "shrink-0 rounded-lg border px-2.5 py-1 text-xs transition",
                            saved.includes(job.id)
                              ? "border-amber-500 bg-amber-50 text-amber-700"
                              : "border-neutral-300 hover:bg-neutral-50 text-neutral-700"
                          ].join(' ')}
                        >
                          {saved.includes(job.id) ? 'Saved' : 'Save'}
                        </button>
                      </div>
                      <p className="text-sm text-neutral-600">{job.company || 'Company'}</p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge icon={<PinIcon className="h-3.5 w-3.5" />}>{job.location}</Badge>
                        <Badge tone="blue">{job.contract}</Badge>
                        <Badge tone="green">{job.industry}</Badge>
                        <Badge tone="violet">{job.remote}</Badge>
                        <span className="ml-auto text-xs text-neutral-500">Posted: {job.posted}</span>
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm text-neutral-600">
                        {job.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Detail (sticky on desktop) */}
            <div className="hidden lg:block">
              <DetailPanel
                job={selected}
                onApply={() => applySelected(selected)}
                onSave={() => selected && toggleSave(selected.id)}
                saved={selected ? saved.includes(selected.id) : false}
              />
            </div>
          </div>
        )}
      </main>

      {/* Mobile detail modal */}
      {mobileDetailOpen && (
        <Modal onClose={() => setMobileDetailOpen(false)}>
          <DetailPanel
            job={selected}
            onApply={() => { applySelected(selected); setMobileDetailOpen(false) }}
            onSave={() => selected && toggleSave(selected.id)}
            saved={selected ? saved.includes(selected.id) : false}
          />
        </Modal>
      )}
    </div>
  )

  function applySelected(sel: Job | null) {
    if (!sel) return
    const cur = localStorage.getItem('ark_current')
    if (!cur) { window.location.href='/auth/signin'; return }
    const apps = JSON.parse(localStorage.getItem('ark_apps') ?? '{}')
    const arr = apps[cur] ?? []
    if (arr.find((a:any)=>a.jobId===sel.id)) { alert('You already applied to this job!'); return }
    arr.push({ jobId: sel.id, date: new Date().toISOString().split('T')[0] })
    apps[cur]=arr; localStorage.setItem('ark_apps', JSON.stringify(apps))
    alert('Application submitted!')
  }
}

/* ---------------- Small UI parts ---------------- */

function Input({
  value, onChange, placeholder, icon,
}: { value:string; onChange:(v:string)=>void; placeholder:string; icon?:React.ReactNode }) {
  return (
    <label className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">{icon}</span>
      <input
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-neutral-300 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-neutral-400"
      />
    </label>
  )
}

function Select({
  value, onChange, options, label
}: { value:string; onChange:(v:string)=>void; options:string[]; label:string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-wide text-neutral-500">{label}</span>
      <select
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm"
      >
        {options.map(o => <option key={o || 'all'} value={o}>{o || `All ${label}`}</option>)}
      </select>
    </label>
  )
}

function Chip({ children, onClear }: { children: React.ReactNode; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs text-neutral-700">
      {children}
      <button onClick={onClear} className="ml-1 rounded p-0.5 hover:bg-neutral-100" aria-label="Remove filter">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>
    </span>
  )
}

function Badge({
  children, icon, tone
}: { children: React.ReactNode; icon?: React.ReactNode; tone?: 'blue'|'green'|'violet' }) {
  const tones: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    violet: 'bg-violet-50 text-violet-700 border-violet-100',
    default: 'bg-neutral-100 text-neutral-700 border-neutral-200'
  }
  const cls = tones[tone || 'default']
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] ${cls}`}>
      {icon}{children}
    </span>
  )
}

function DetailPanel({
  job, onApply, onSave, saved
}: { job: Job | null; onApply: () => void; onSave: () => void; saved: boolean }) {
  if (!job) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
        Select a job to see details
      </div>
    )
  }
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sticky top-28">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-amber-400 grid place-items-center text-white font-bold">
          {initials(job.company || 'AW')}
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-900">{job.title}</h2>
          <p className="text-sm text-neutral-600">{job.company || 'Company'} • {job.location}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <Info label="Industry" value={job.industry} />
        <Info label="Contract" value={job.contract} />
        <Info label="Function" value={job.function} />
        <Info label="Work mode" value={job.remote} />
        <Info label="Posted" value={job.posted} />
        <Info label="ID" value={String(job.id)} />
      </div>

      <p className="mt-4 text-neutral-700">{job.description}</p>

      <div className="mt-6 space-y-2">
        <button
          onClick={onApply}
          className="w-full rounded-xl bg-neutral-900 px-4 py-2.5 text-white hover:opacity-90"
        >
          Apply Now
        </button>
        <button
          onClick={onSave}
          className={`w-full rounded-xl px-4 py-2.5 ${saved ? 'bg-amber-500 text-white' : 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'}`}
        >
          {saved ? 'Saved' : 'Save Job'}
        </button>
        <button
          onClick={()=>{
            const url = `${window.location.origin}?job=${job.id}`
            navigator.clipboard.writeText(url).then(()=>alert('Job link copied to clipboard!'))
          }}
          className="w-full rounded-xl bg-neutral-200 px-4 py-2.5 text-neutral-800 hover:bg-neutral-300"
        >
          Share
        </button>
      </div>
    </div>
  )
}

function Info({ label, value }: { label:string; value:string }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-neutral-500">{label}</div>
      <div className="text-sm text-neutral-900">{value}</div>
    </div>
  )
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-2xl rounded-t-3xl bg-white p-5 shadow-2xl">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-semibold text-neutral-800">Job details</div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl border border-neutral-200 hover:bg-neutral-50">
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-12 text-center">
      <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-neutral-100 grid place-items-center">
        <SearchIcon className="h-6 w-6 text-neutral-600" />
      </div>
      <h3 className="font-semibold text-neutral-900">No jobs found</h3>
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

/* ---------------- Utils ---------------- */
function labelize(k: string) {
  switch (k) {
    case 'q': return 'Keyword'
    case 'loc': return 'Location'
    case 'func': return 'Function'
    default: return k.charAt(0).toUpperCase() + k.slice(1)
  }
}
function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0,2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}
