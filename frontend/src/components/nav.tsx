'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()

  // close drawer saat klik di luar
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (!t.closest('#mobileMenu') && !t.closest('#mobileBtn')) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  const links = useMemo(
    () => [
      { href: '/', label: 'Home' },
      { href: '/jobs', label: 'Jobs' },
      { href: '/tender', label: 'Tenders' },
      { href: '/news', label: 'News' },
      { href: '/about', label: 'About' },
    ],
    []
  )

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200/60 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-neutral-800 dark:bg-neutral-950/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-amber-400 shadow-sm" />
          <span className="font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            ArkWork
          </span>
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
                className="inline-flex items-center rounded-xl border border-blue-600 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center rounded-xl bg-amber-500 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-600"
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
              <span className="hidden text-sm text-neutral-600 dark:text-neutral-400 lg:inline">
                Hi, {user.name}!
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center rounded-xl border border-red-600 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white"
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
        className={`fixed inset-0 z-[55] bg-black/30 transition-opacity md:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      {/* Mobile Drawer */}
      <aside
        id="mobileMenu"
        className={`fixed inset-y-0 right-0 z-[60] w-[80%] max-w-xs transform bg-white p-4 shadow-2xl transition-transform dark:bg-neutral-950 md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-amber-400" />
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">ArkWork</span>
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

        <nav className="mt-2 space-y-1">
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={[
                  'block rounded-xl px-3 py-2 text-sm',
                  active
                    ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-white'
                    : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900',
                ].join(' ')}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>

        <hr className="my-4 border-neutral-200 dark:border-neutral-800" />

        {!user ? (
          <div className="space-y-2">
            <Link
              href="/auth/signin"
              onClick={() => setOpen(false)}
              className="block rounded-xl border border-blue-600 px-3 py-2 text-center text-sm font-medium text-blue-700 hover:bg-blue-50"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              onClick={() => setOpen(false)}
              className="block rounded-xl bg-amber-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-amber-600"
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
      </aside>
    </nav>
  )
}

/* -------- small subcomponent for desktop link -------- */

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
