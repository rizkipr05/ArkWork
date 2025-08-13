'use client';

import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  const linkCls =
    'text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white';

  return (
    <footer className="mt-16 border-t border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Top */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-amber-400 shadow" />
              <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                ArkWork
              </span>
            </div>
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
              Build your career in the energy sector: jobs, tenders, and insights for oil & gas,
              LNG, and utilities professionals.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <Social href="https://x.com" label="X / Twitter">
                <path d="M18 2H6a4 4 0 00-4 4v12a4 4 0 004 4h12a4 4 0 004-4V6a4 4 0 00-4-4Zm-2.56 15-3.07-4.12L8.4 17H6.5l4.11-5.02L6.5 7h2.06l2.82 3.79L14.85 7h1.9l-3.9 4.77 4.12 5.23h-1.53Z" />
              </Social>
              <Social href="https://linkedin.com" label="LinkedIn">
                <path d="M4 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3 8h2v13H3V8Zm5 0h2v2h.03c.28-.53 1.02-1.09 2.1-1.09C14.76 8.91 16 10 16 12.33V21h-2v-7.3c0-1.37-.49-2.3-1.71-2.3-.93 0-1.49.63-1.73 1.24-.09.2-.11.48-.11.76V21H8V8Z" />
              </Social>
              <Social href="mailto:hello@arkwork.app" label="Email">
                <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2Zm8 7L4.5 6.5h15L12 11Z" />
              </Social>
            </div>
          </div>

          {/* Columns */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Product</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/jobs" className={linkCls}>Jobs</Link></li>
              <li><Link href="/tender" className={linkCls}>Tenders</Link></li>
              <li><Link href="/news" className={linkCls}>Industry News</Link></li>
              <li><Link href="/applications" className={linkCls}>Companies</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Company</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/about" className={linkCls}>About</Link></li>
              <li><Link href="/profile" className={linkCls}>Profile</Link></li>
              <li><Link href="/dashboard" className={linkCls}>Dashboard</Link></li>
              <li><Link href="/contact" className={linkCls}>Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Legal</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/terms" className={linkCls}>Terms</Link></li>
              <li><Link href="/privacy" className={linkCls}>Privacy</Link></li>
              <li><Link href="/cookies" className={linkCls}>Cookies</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-neutral-200 pt-5 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400 md:flex-row">
          <p>© {year} ArkWork. All rights reserved.</p>
          <p className="opacity-80">Made for the energy & oil & gas community.</p>
        </div>
      </div>
    </footer>
  );
}

function Social({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="grid h-9 w-9 place-items-center rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        {children}
      </svg>
    </a>
  );
}
