'use client';

import {NextIntlClientProvider, useLocale, useMessages} from 'next-intl';

export default function IntlProvider({children}: {children: React.ReactNode}) {
  const locale = useLocale();
  const messages = useMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
