'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { usePathname } from 'next/navigation'

// Static import agar logo selalu ter-bundle
import ArkLogo from '@/app/Images/Ungu__1_-removebg-preview.png'

export default function Nav() {
  const pathname = usePathname()

  // ⬇️ Sembunyikan navbar saat berada di /admin (termasuk semua sub-route)
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const drawerRef = useRef<HTMLDivElement>(null)

  // Tutup saat klik di luar / tekan ESC
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!(e.target instanceof HTMLElement)) return
      if (!e.target.closest('#mobileMenu') && !e.target.closest('#mobileBtn')) setOpen(false)
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('click', onDoc)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('click', onDoc)
      document.removeEventListener('keydown', onEsc)
    }
  }, [])

  // Prevent body scroll saat drawer open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  const links = useMemo(
    () => [
      { href: '/', label: 'Home', icon: HomeIcon },
      { href: '/jobs', label: 'Jobs', icon: BriefcaseIcon },
      { href: '/tender', label: 'Tenders', icon: FileTextIcon },
      { href: '/news', label: 'News', icon: NewspaperIcon },
      { href: '/about', label: 'About', icon: InfoIcon },
    ],
    []
  )

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200/60 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-neutral-800 dark:bg-neutral-950/60">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="ArkWork Home">
          <Image
            src={ArkLogo}
            alt="ArkWork"
            width={240}
            height={240}
            priority
            className="w-auto h-20 md:h-20 object-contain"
          />
        </Link>

        {/* Desktop menu */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <NavLink key={l.href} href={l.href} active={active}>
                {l.label}
              </NavLink>
            )
          })}
        </div>

        {/* Auth (desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          {!user ? (
            <>
              <Link
                href="/auth/signin"
                className="inline-flex items-center rounded-xl border border-blue-600 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="inline-flex items-center rounded-xl border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile button */}
        <button
          id="mobileBtn"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="grid h-10 w-10 place-items-center rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 active:translate-y-[1px] md:hidden dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[55] bg-black/40 backdrop-blur-[1px] transition-opacity duration-200 md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!open}
      />

      {/* Mobile Drawer */}
      <aside
        id="mobileMenu"
        ref={drawerRef}
        className={`fixed inset-y-0 right-0 z-[60] w-[86%] max-w-sm transform transition-transform duration-250 ease-out md:hidden
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
      >
        {/* Card container */}
        <div className="relative m-3 ms-auto h-[calc(100vh-1.5rem)] w-full overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <Image
                src={ArkLogo}
                alt="ArkWork"
                width={120}
                height={120}
                priority
                className="h-10 w-auto object-contain md:h-12"
              />
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid h-9 w-9 place-items-center rounded-xl border border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Body: scrollable */}
          <div className="flex h-[calc(100%-7.5rem)] flex-col">
            {/* Links */}
            <nav className="flex-1 overflow-y-auto px-3 py-2">
              <ul className="space-y-1">
                {links.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setOpen(false)}
                        className={[
                          'flex items-center gap-3 rounded-xl px-3 py-3 text-[15px]',
                          active
                            ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-white'
                            : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900',
                        ].join(' ')}
                      >
                        <Icon className="h-5 w-5 opacity-90" />
                        <span>{label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>

              {/* Divider */}
              <hr className="my-4 border-neutral-200 dark:border-neutral-800" />

              {/* Account area */}
              {!user ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/auth/signin"
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-blue-600 px-3 py-2 text-center text-sm font-medium text-blue-700 hover:bg-blue-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-amber-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-amber-600"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-2 text-center text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false)
                      logout()
                    }}
                    className="block w-full rounded-xl border border-red-600 px-3 py-2 text-center text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              )}
            </nav>

            {/* Sticky CTA bottom (safe-area aware) */}
            <div className="border-t border-neutral-200 bg-white px-3 py-3 dark:border-neutral-800 dark:bg-neutral-950 [padding-bottom:calc(env(safe-area-inset-bottom)+12px)]">
              <Link
                href="/news"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white hover:opacity-90 active:translate-y-[1px] dark:bg-white dark:text-neutral-900"
              >
                <LightningIcon className="h-4 w-4" />
                Explore Energy Updates
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </nav>
  )
}

/* -------- Desktop link kecil -------- */
function NavLink({
  href,
  active,
  children,
}: {
  href: string
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={[
        'rounded-xl px-3 py-2 text-sm transition',
        active
          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
          : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900',
      ].join(' ')}
    >
      {children}
    </Link>
  )
}

/* --------- Ikon SVG minimal (tanpa dependency) --------- */
function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}
function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
function FileTextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" stroke="currentColor" strokeWidth="2" />
      <path d="M14 2v6h6M8 13h8M8 17h6M8 9h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
function NewspaperIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 16v-5M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
function LightningIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M13 2 3 14h7l-1 8 12-14h-7l1-6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}