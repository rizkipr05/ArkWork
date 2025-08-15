// src/app/layout.tsx
import './globals.css';
import {Inter} from 'next/font/google';
import Nav from '@/components/nav';
import {AuthProvider} from '@/hooks/useAuth';
import type {Metadata} from 'next';
import ClientShell from './ClientShell';
import Footer from '@/components/Footer';

import {NextIntlClientProvider} from 'next-intl';
import {cookies, headers} from 'next/headers';

const inter = Inter({subsets: ['latin'], variable: '--font-inter'});

export const metadata: Metadata = {
  title: 'ArkWork - Build Your Career in Energy & Oil & Gas',
  description: 'Find the latest jobs, tenders, and trainings only on ArkWork',
  icons: {icon: '/logo', shortcut: '/logo', apple: '/logo'},
  openGraph: {
    title: 'ArkWork - Build Your Career in Energy & Oil & Gas',
    description: 'Find the latest jobs, tenders, and trainings only on ArkWork',
    images: [{url: '/logo', width: 2000, height: 2000, alt: 'ArkWork Logo'}]
  }
};

async function resolveLocale(): Promise<'en'|'id'> {
  const ck = cookies().get('NEXT_LOCALE')?.value;
  if (ck === 'en' || ck === 'id') return ck;
  const accept = headers().get('accept-language') || '';
  return accept.startsWith('id') ? 'id' : 'en';
}

async function loadMessages(locale: 'en'|'id') {
  // ⚠️ Import statis (bukan template string) agar tidak di-tree‑shake
  switch (locale) {
    case 'id':
      return (await import('../messages/id.json')).default;
    case 'en':
    default:
      return (await import('../messages/en.json')).default;
  }
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const locale = await resolveLocale();
  const messages = await loadMessages(locale);

  // Safety: kalau gagal load, lempar error biar kelihatan di console
  if (!messages || Object.keys(messages).length === 0) {
    console.error('[i18n] messages kosong untuk locale:', locale);
  }

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" rel="stylesheet" />
      </head>
      <body className="bg-gray-50">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <Nav />
            <ClientShell>
              <main className="pt-16">{children}</main>
              <Footer />
            </ClientShell>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
  