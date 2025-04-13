import { headers } from 'next/headers';
import { isLocalHost } from '../validator';

export function fetchConfigByServer(url: string, locale: string = 'zh-cn') {
  const h = headers();
  const host = h.get('host');
  const origin = isLocalHost(host) ? process.env.SERVER_URL : `https://${host}/`;

  if (!/^https?\/\//i.test(url)) url = origin + url;
  return fetch(url, {
    headers: { Cookie: `locale=${locale?.toLocaleLowerCase?.()};` }
  })
    .then(res => res.json())
    .catch(() => ({ defaultMessage: 'Default message' }));
}
