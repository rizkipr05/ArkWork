'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import ChatbotWidget from '@/components/ChatbotWidget';

export default function ClientShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideOnAuth = pathname.startsWith('/auth'); // sembunyikan di /auth/**

  return (
    <>
      {children}
      {!hideOnAuth && <ChatbotWidget />}
    </>
  );
}
