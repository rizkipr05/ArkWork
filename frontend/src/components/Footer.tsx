'use client';

import Link from 'next/link';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import Logo from '@/app/Images/Ungu__1_-removebg-preview.png'; // pastikan path & kapitalisasi benar

export default function Footer() {
  const t = useTranslations();
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
              <Image src={Logo} alt={t('footer.logoAlt')} className="h-20 w-auto" priority />
            </div>

            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
              {t('footer.description')}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <Social href="https://x.com" label={t('footer.social.x')}>
                <path d="M18 2H6a4 4 0 00-4 4v12a4 4 0 004 4h12a4 4 0 004-4V6a4 4 0 00-4-4Zm-2.56 15-3.07-4.12L8.4 17H6.5l4.11-5.02L6.5 7h2.06l2.82 3.79L14.85 7h1.9l-3.9 4.77 4.12 5.23h-1.53Z" />
              </Social>
              <Social href="https://linkedin.com" label={t('footer.social.linkedin')}>
                <path d="M4 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3 8h2v13H3V8Zm5 0h2v2h.03c.28-.53 1.02-1.09 2.1-1.09C14.76 8.91 16 10 16 12.33V21h-2v-7.3c0-1.37-.49-2.3-1.71-2.3-.93 0-1.49.63-1.73 1.24-.09.2-.11.48-.11.76V21H8V8Z" />
              </Social>
              <Social href="mailto:hello@company.com" label={t('footer.social.email')}>
                <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2Zm8 7L4.5 6.5h15L12 11Z" />
              </Social>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {t('footer.headings.product')}
            </h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/jobs" className={linkCls}>{t('footer.links.jobs')}</Link></li>
              <li><Link href="/tender" className={linkCls}>{t('footer.links.tenders')}</Link></li>
              <li><Link href="/news" className={linkCls}>{t('footer.links.news')}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {t('footer.headings.company')}
            </h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/" className={linkCls}>{t('footer.links.home')}</Link></li>
              <li><Link href="/about" className={linkCls}>{t('footer.links.about')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {t('footer.headings.legal')}
            </h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/terms" className={linkCls}>{t('footer.links.terms')}</Link></li>
              <li><Link href="/privacy" className={linkCls}>{t('footer.links.privacy')}</Link></li>
              <li><Link href="/cookies" className={linkCls}>{t('footer.links.cookies')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-neutral-200 pt-5 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400 md:flex-row">
          <p>{t('footer.copyright', {year})}</p>
          <p className="opacity-80">{t('footer.madeFor')}</p>
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
