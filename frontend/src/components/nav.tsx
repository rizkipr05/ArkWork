'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

// Static import agar logo selalu ter-bundle
import ArkLogo from '@/app/Images/Ungu__1_-removebg-preview.png'

export default function Nav() {
  const pathname = usePathname()
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()

  // Sembunyikan navbar di /admin/*
  if (pathname?.startsWith('/admin')) return null

  const [open, setOpen] = useState(false)          // mobile drawer
  const [menuOpen, setMenuOpen] = useState(false)  // avatar dropdown
  const { user, logout } = useAuth()
  const menuRef = useRef<HTMLDivElement>(null)

  // Tutup saat klik di luar / tekan ESC
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!(e.target instanceof HTMLElement)) return
      if (!e.target.closest('#mobileMenu') && !e.target.closest('#mobileBtn')) setOpen(false)
      if (!e.target.closest('#avatarMenu') && !e.target.closest('#avatarBtn')) setMenuOpen(false)
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setMenuOpen(false)
      }
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
      { href: '/', label: t('nav.home'), icon: HomeIcon },
      { href: '/jobs', label: t('nav.jobs'), icon: BriefcaseIcon },
      { href: '/tender', label: t('nav.tenders'), icon: FileTextIcon },
      { href: '/news', label: t('nav.news'), icon: NewspaperIcon },
      { href: '/about', label: t('nav.about'), icon: InfoIcon },
    ],
    [t]
  )

  const displayName = (user as any)?.displayName || t('user.fallback')
  const email = (user as any)?.email
  const photoURL = (user as any)?.photoURL

  // Toggle bahasa via cookie + refresh (tanpa ubah URL)
  const switchLocale = () => {
    const next = locale === 'en' ? 'id' : 'en'
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000`
    router.refresh()
  }

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
            className="w-auto h-20 md:h-25 object-contain"
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

        {/* Right actions (desktop): Lang + Auth */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Language button */}
          <button
            onClick={switchLocale}
            aria-label={t('lang.switch')}
            title={t('lang.switch')}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900"
          >
            <GlobeIcon className="h-4 w-4" />
            <span className="font-semibold">{locale === 'en' ? 'EN' : 'ID'}</span>
          </button>

          {/* Auth (desktop) */}
          {!user ? (
            <>
              <Link
                href="/auth/signin"
                className="inline-flex items-center rounded-xl border border-blue-600 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
              >
                {t('auth.signIn')}
              </Link>
              <Link
                href="/auth/signup_perushaaan"
                className="inline-flex items-center rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
              >
                {t('auth.signUp')}
              </Link>
            </>
          ) : (
            <div className="relative" ref={menuRef}>
              {/* Tombol avatar (luar): avatar + NAMA + chevron */}
              <button
                id="avatarBtn"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"           
                aria-expanded={menuOpen}
                aria-label={t('menu.user')}
                className="flex items-center gap-2 rounded-2xl border border-neutral-200 px-2 py-1.5 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
              >
                <Avatar src={photoURL} alt={displayName} size={32} />
                <span className="hidden sm:block max-w-[160px] truncate text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                  {displayName}
                </span>
                <ChevronDownIcon className={`h-4 w-4 text-neutral-500 transition ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              <div
                id="avatarMenu"
                role="menu"
                aria-hidden={!menuOpen}
                className={[
                  'absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-950',
                  menuOpen ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-1',
                  'transition-all duration-150'
                ].join(' ')}
              >
                {/* Header di dalam: avatar + nama + email */}
                <div className="px-3 py-3 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <Avatar src={photoURL} alt={displayName} size={40} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                        {displayName}
                      </p>
                      {!!email && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                          {email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="py-1">
                  <MenuItem href="/profile" onClick={() => setMenuOpen(false)}>
                    <UserIcon className="h-4 w-4" />
                    <span>{t('user.profile')}</span>
                  </MenuItem>
                  <MenuItem href="/dashboard" onClick={() => setMenuOpen(false)}>
                    <GridIcon className="h-4 w-4" />
                    <span>{t('user.dashboard')}</span>
                  </MenuItem>
                  <hr className="my-1 border-neutral-200 dark:border-neutral-800" />
                  <button
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false)
                      logout()
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-neutral-900"
                  >
                    <LogoutIcon className="h-4 w-4" />
                    <span>{t('user.logout')}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile button */}
        <button
          id="mobileBtn"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t('menu.close') : t('menu.open')}
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
              aria-label={t('menu.close')}
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
                    {t('auth.signIn')}
                  </Link>
                  <Link
                    href="/auth/signup_perushaan"
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-amber-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-amber-600"
                  >
                    {t('auth.signUp')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Kartu user (nama+email) */}
                  <div className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3 dark:border-neutral-800">
                    <Avatar src={photoURL} alt={displayName} size={40} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                        {displayName}
                      </p>
                      {!!email && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                          {email}
                        </p>
                      )}
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-2 text-center text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900"
                  >
                    {t('user.profile')}
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-2 text-center text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900"
                  >
                    {t('user.dashboard')}
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false)
                      logout()
                    }}
                    className="block w-full rounded-xl border border-red-600 px-3 py-2 text-center text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white"
                  >
                    {t('user.logout')}
                  </button>
                </div>
              )}
            </nav>

            {/* Sticky CTA bottom (safe-area aware) */}
            <div className="border-t border-neutral-200 bg-white px-3 py-3 dark:border-neutral-800 dark:bg-neutral-950 [padding-bottom:calc(env(safe-area-inset-bottom)+12px)] space-y-2">
              <Link
                href="/news"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white hover:opacity-90 active:translate-y-[1px] dark:bg-white dark:text-neutral-900"
              >
                <LightningIcon className="h-4 w-4" />
                {t('cta.energy')}
              </Link>

              {/* Language button (mobile) */}
              <button
                onClick={() => {
                  switchLocale()
                  setOpen(false)
                }}
                aria-label={t('lang.switch')}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-300 px-4 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900"
              >
                <GlobeIcon className="h-4 w-4" />
                <span>{locale === 'en' ? 'Bahasa Indonesia' : 'English'}</span>
              </button>
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

/* --------- Helper: Avatar + MenuItem --------- */
function Avatar({ src, alt, size = 32 }: { src?: string; alt: string; size?: number }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="h-8 w-8 rounded-full object-cover ring-1 ring-neutral-200 dark:ring-neutral-800"
      />
    )
  }
  const initial = (alt || 'U').trim().charAt(0).toUpperCase()
  return (
    <div
      aria-hidden
      style={{ width: size, height: size }}
      className="grid place-items-center rounded-full bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
    >
      <span className="text-sm font-semibold">{initial}</span>
    </div>
  )
}

function MenuItem({
  href,
  onClick,
  children,
}: {
  href: string
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      role="menuitem"
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-900"
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
function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-5 0-9 3-9 6v1h18v-1c0-3-4-6-9-6Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
function GridIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M3 3h8v8H3V3Zm10 0h8v8h-8V3ZM3 13h8v8H3v-8Zm10 0h8v8h-8v-8Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
function LogoutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M15 17l5-5-5-5M20 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 21h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M3 12h18M12 3a12 12 0 0 0 0 18M12 3a12 12 0 0 1 0 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
