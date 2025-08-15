"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import ArkHero from "@/app/Images/1.jpg";

export default function HomePage() {
  const t = useTranslations();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden" aria-labelledby="hero-title">
        <div className="absolute inset-0 -z-20">
          <Image
            src={ArkHero}
            alt="ArkWork Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_35%]"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(1000px 500px at 20% -10%, rgba(29,78,216,.30), transparent), radial-gradient(800px 450px at 90% 0%, rgba(234,179,8,.18), transparent)",
          }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <h1 id="hero-title" className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-sm">
            {t('home.hero.title.1')}{' '}
            <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-amber-300 bg-clip-text text-transparent">
              {t('home.hero.title.2')}
            </span>
          </h1>

          <p className="mt-4 text-lg md:text-xl text-neutral-100/90 max-w-3xl mx-auto">
            {t('home.hero.desc')}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <a
              href="/jobs"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow hover:bg-blue-500 active:translate-y-[1px] transition"
            >
              {t('home.hero.cta.jobs')}
            </a>
            <a
              href="/applications"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-white font-semibold backdrop-blur hover:bg-white/20 transition"
            >
              {t('home.hero.cta.companies')}
            </a>
          </div>
        </div>
      </section>

      {/* EXPLORE WITHOUT SIGNING IN */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
              {t('home.explore.title')}
            </h2>
            <p className="mt-2 text-neutral-600 max-w-3xl mx-auto">
              {t('home.explore.desc')}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <CardLink
              href="/jobs"
              title={t('home.card.jobs.title')}
              desc={t('home.card.jobs.desc')}
              icon={<MagnifierIcon className="h-6 w-6 text-blue-700" />}
            />
            <CardLink
              href="/applications"
              title={t('home.card.companies.title')}
              desc={t('home.card.companies.desc')}
              icon={<BuildingIcon className="h-6 w-6 text-emerald-600" />}
            />
            <CardLink
              href="/news"
              title={t('home.card.news.title')}
              desc={t('home.card.news.desc')}
              icon={<PulseIcon className="h-6 w-6 text-violet-600" />}
            />
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-12 md:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
              {t('home.features.title')}
            </h2>
            <p className="mt-2 text-neutral-600 max-w-3xl mx-auto">
              {t('home.features.desc')}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Feature
              title={t('home.feature.1.title')}
              desc={t('home.feature.1.desc')}
              icon={<SearchSparkIcon className="h-6 w-6 text-blue-700" />}
            />
            <Feature
              title={t('home.feature.2.title')}
              desc={t('home.feature.2.desc')}
              icon={<FolderIcon className="h-6 w-6 text-indigo-600" />}
            />
            <Feature
              title={t('home.feature.3.title')}
              desc={t('home.feature.3.desc')}
              icon={<MatchIcon className="h-6 w-6 text-sky-600" />}
            />
            <Feature
              title={t('home.feature.4.title')}
              desc={t('home.feature.4.desc')}
              icon={<NewsIcon className="h-6 w-6 text-rose-600" />}
            />
            <Feature
              title={t('home.feature.5.title')}
              desc={t('home.feature.5.desc')}
              icon={<UsersIcon className="h-6 w-6 text-amber-600" />}
            />
            <Feature
              title={t('home.feature.6.title')}
              desc={t('home.feature.6.desc')}
              icon={<BoltIcon className="h-6 w-6 text-emerald-600" />}
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-neutral-200 bg-gradient-to-tr from-blue-700 via-blue-600 to-amber-500 p-[1px] shadow">
            <div className="rounded-3xl bg-white p-8 md:p-12 text-center">
              <h3 className="text-2xl md:text-3xl font-extrabold text-neutral-900">
                {t('home.final.title')}
              </h3>
              <p className="mt-2 text-neutral-600 max-w-3xl mx-auto">
                {t('home.final.desc')}
              </p>
              <div className="mt-6">
                <a
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow hover:bg-blue-500 active:translate-y-[1px] transition"
                >
                  {t('home.final.cta')}
                </a>
              </div>
              <p className="mt-3 text-xs text-neutral-500">
                {t('home.final.note')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------- Small components ---------- */
function CardLink({ href, title, desc, icon }:{ href:string; title:string; desc:string; icon:React.ReactNode }) {
  return (
    <a href={href} className="group block rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-neutral-100 grid place-items-center group-hover:scale-105 transition">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-neutral-900">{title}</h3>
          <p className="text-sm text-neutral-600 mt-0.5">{desc}</p>
        </div>
      </div>
    </a>
  )
}

/* ---------- Feature & icons: biarkan sama ---------- */
function Feature({ title, desc, icon }:{ title:string; desc:string; icon:React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-neutral-100 grid place-items-center">
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-neutral-900">{title}</h4>
          <p className="text-sm text-neutral-600 mt-1">{desc}</p>
        </div>
      </div>
    </div>
  )
}
function MagnifierIcon(p:any){return(<svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>)}
function BuildingIcon(p:any){return(<svg viewBox="0 0 24 24" fill="none" {...p}><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M8 7h3M8 11h3M8 15h3M13 7h3M13 11h3M13 15h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>)}
function PulseIcon(p:any){return(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M3 12h4l2-6 4 12 2-6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
function SearchSparkIcon(p:any){return(<svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M7 4l1-2 1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="currentColor"/></svg>)}
function FolderIcon(p:any){return(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M3 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="2"/></svg>)}
function MatchIcon(p:any){return(<svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="2"/><circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="2"/><path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="2"/></svg>)}
function NewsIcon(p:any){return(<svg viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>)}
function UsersIcon(p:any){return(<svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="2"/><circle cx="16" cy="11" r="3" stroke="currentColor" strokeWidth="2"/><path d="M3 20a5 5 0 017-4.58M14 20a5 5 0 015-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>)}
function BoltIcon(p:any){return(<svg viewBox="0 0 24 24" fill="none" {...p}><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>)}
