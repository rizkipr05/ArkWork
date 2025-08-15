import {getRequestConfig} from 'next-intl/server';
import {cookies, headers} from 'next/headers';

export default getRequestConfig(async () => {
  const ck = cookies().get('NEXT_LOCALE')?.value;
  const accept = headers().get('accept-language') || '';
  const locale: 'en'|'id' = ck === 'en' || ck === 'id' ? ck : accept.startsWith('id') ? 'id' : 'en';
  const messages = (await import(`../messages/${locale}.json`)).default;
  return {locale: 'en', messages: {}};
});
