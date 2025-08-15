// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import Nav from '@/components/nav'
import { AuthProvider } from '@/hooks/useAuth'
import type { Metadata } from 'next'
import ClientShell from './ClientShell'   // jika sudah ada (untuk chatbot)
import Footer from '@/components/Footer'   // <--- tambahkan

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'ArkWork - Build Your Career in Energy & Oil & Gas',
  description: 'Find the latest jobs, tenders, and trainings only on ArkWork',
  icons: {
    icon: '/logo',
    shortcut: '/logo',
    apple: '/logo'
  },
  openGraph: {
    title: 'ArkWork - Build Your Career in Energy & Oil & Gas',
    description: 'Find the latest jobs, tenders, and trainings only on ArkWork',
    images: [
      {
        url: '/logo',
        width: 2000,
        height: 2000,
        alt: 'ArkWork Logo'
      }
    ]
  }
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-50">
        <AuthProvider>
          <Nav />
          {/* Jika pakai ClientShell untuk chatbot, bungkus main+footer di dalamnya */}
          <ClientShell>
            <main className="pt-16">{children}</main>
            <Footer /> {/* <-- tampil di semua halaman */}
          </ClientShell>
        </AuthProvider>
      </body>
    </html>
  )
}
