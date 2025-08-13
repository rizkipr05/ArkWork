"use client";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section
        className="relative overflow-hidden"
        aria-labelledby="hero-title"
      >
        {/* background */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(1200px 600px at 20% -10%, rgba(29,78,216,.35), transparent), radial-gradient(900px 500px at 90% 0%, rgba(234,179,8,.25), transparent)",
          }}
        />
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute top-16 -right-24 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <h1
            id="hero-title"
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-900"
          >
            Power Your Career in the{" "}
            <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-amber-500 bg-clip-text text-transparent">
              Energy Sector
            </span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
            ArkWork connects energy professionals with opportunities across
            oil & gas, LNG, utilities, and emerging energy technologies. Browse jobs,
            get industry insights, and discover companies—all in one place.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <a
              href="/jobs"
              className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-6 py-3 text-white font-semibold shadow hover:bg-blue-600 active:translate-y-[1px] transition"
            >
              Explore Jobs
            </a>
            <a
              href="/applications"
              className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 py-3 text-neutral-900 font-semibold hover:bg-neutral-50 transition"
            >
              Browse Companies
            </a>
          </div>
        </div>
      </section>

      {/* EXPLORE WITHOUT SIGNING IN */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
              Explore Without Signing In
            </h2>
            <p className="mt-2 text-neutral-600 max-w-3xl mx-auto">
              Browse jobs, discover companies, and stay updated with industry
              news. Sign in only when you&apos;re ready to apply.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <CardLink
              href="/jobs"
              title="Browse Jobs"
              desc="Search thousands of sector opportunities with advanced filters."
              icon={
                <MagnifierIcon className="h-6 w-6 text-blue-700" />
              }
            />
            <CardLink
              href="/applications"
              title="Discover Companies"
              desc="Explore energy companies and learn about their culture and opportunities."
              icon={<BuildingIcon className="h-6 w-6 text-emerald-600" />}
            />
            <CardLink
              href="/news"
              title="Industry News"
              desc="Stay updated with the latest energy sector news and tender opportunities."
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
              Everything You Need for Energy Careers
            </h2>
            <p className="mt-2 text-neutral-600 max-w-3xl mx-auto">
              From job search to industry insights, ArkWork provides comprehensive
              tools for energy sector professionals.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Feature
              title="Smart Job Search"
              desc="Find energy sector jobs with AI-powered matching and advanced filters."
              icon={<SearchSparkIcon className="h-6 w-6 text-blue-700" />}
            />
            <Feature
              title="Company Profiles"
              desc="Discover energy companies and their opportunities in one place."
              icon={<FolderIcon className="h-6 w-6 text-indigo-600" />}
            />
            <Feature
              title="Talent Matching"
              desc="Get matched with relevant opportunities based on your skills and experience."
              icon={<MatchIcon className="h-6 w-6 text-sky-600" />}
            />
            <Feature
              title="Industry News"
              desc="Stay updated with the latest energy sector news and tenders."
              icon={<NewsIcon className="h-6 w-6 text-rose-600" />}
            />
            <Feature
              title="Professional Network"
              desc="Connect with energy professionals and industry leaders."
              icon={<UsersIcon className="h-6 w-6 text-amber-600" />}
            />
            <Feature
              title="Energy Focus"
              desc="Dedicated stream for oil & gas, LNG, and utilities insights."
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
                Ready to Energize Your Career?
              </h3>
              <p className="mt-2 text-neutral-600 max-w-3xl mx-auto">
                Join thousands of energy professionals who trust ArkWork for
                their career growth—jobs, insights, and a supportive network.
              </p>
              <div className="mt-6">
                <a
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-6 py-3 text-white font-semibold shadow hover:bg-blue-600 active:translate-y-[1px] transition"
                >
                  Go to Dashboard
                </a>
              </div>
              <p className="mt-3 text-xs text-neutral-500">
                No credit card required • Sign up takes less than 1 minute
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------- Small components ---------- */

function CardLink({
  href,
  title,
  desc,
  icon,
}: {
  href: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="group block rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md transition"
    >
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
  );
}

function Feature({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-neutral-100 grid place-items-center">{icon}</div>
        <div>
          <h4 className="font-semibold text-neutral-900">{title}</h4>
          <p className="text-sm text-neutral-600 mt-1">{desc}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Minimal SVG icons (no deps) ---------- */

function MagnifierIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function BuildingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 7h3M8 11h3M8 15h3M13 7h3M13 11h3M13 15h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function PulseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M3 12h4l2-6 4 12 2-6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function SearchSparkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 4l1-2 1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="currentColor" />
    </svg>
  );
}
function FolderIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M3 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function MatchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function NewsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="11" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M3 20a5 5 0 017-4.58M14 20a5 5 0 015-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function BoltIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
