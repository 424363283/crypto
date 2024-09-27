import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { defaultLocale, SupportedLocale, supportedLocales } from './locales';
import { defaultLang, LANGUAGE } from '@/core/i18n/src/constants';
import type { Locale } from 'antd/es/locale';
import { getLocaleFromPath ,getFirstPathAfterLocale} from '@/core/utils';
import { constant } from 'lodash';
import next from 'next';

const PUBLIC_FILE = /\.(.*)$/;
const LOCALE_COOKIE = 'XK_LOCALE';
const ONE_YEAR = 60 * 60 * 24 * 365;

const getLocale = (req: NextRequest) => {
  const { headers, cookies } = req;

  const cookieLang = cookies.get(LOCALE_COOKIE);
  // console.log('cookieLang',cookieLang)

  if (cookieLang?.value) {
    return cookieLang.value;
  }

  const acceptLanguage = headers.get('accept-language');
  // console.log('acceptLanguage',acceptLanguage)

  if (!acceptLanguage) {
    return defaultLang;
  }

  const [lang] = acceptLanguage.split(',');

  return lang.toLowerCase().split('-')[0] || defaultLang;
};

export const middleware = (req: NextRequest) => {
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/api/') ||
    req.nextUrl.pathname.startsWith('/swap/') ||
    req.nextUrl.pathname.startsWith('/apissr/') ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    //console.log(req.nextUrl.pathname,'req.nextUrl.pathname')
    return;
  }
 

  const url = req.nextUrl.clone();
  const { pathname } = req.nextUrl;

  // console.log('>>>log middleware >>>  pathname',pathname)

  // 会导致页面挂
  if (pathname.startsWith('/app')) {
    return new Response(null, {
      status: 400
    });
  }
  // console.log('>>>log middleware >>> defaultLang',defaultLang)

  // const paramLang = url.searchParams.get('lang');
  const languagePath = getLocaleFromPath(pathname) || '';
  const pagePath = pathname.replace(languagePath,'');
  // console.log('>>>log middleware >>> languagePath',languagePath,'pagePath', pagePath)

  const language = languagePath.replace('/','') || getLocale(req);
  const page = pagePath;
  // console.log('>>>log middleware >>> language',language,'page',page)

  const LOCALES = Object.keys(LANGUAGE);
  // console.log('>>>log middleware >>> LOCALES',LOCALES.includes(language))
  
  const validLang = LOCALES.includes(language) ? language.toString() : defaultLang;
  // console.log('>>>log middleware >>> validLang',validLang)

  if (pathname.startsWith('/@')) {
    const [, _slug, ...rest] = pathname.split('/');
    const slug = _slug.substring(1);

    url.pathname = `/app/${validLang}/tenants/${slug}/${rest.join('/')}`;
  } else {
    url.pathname = `/${validLang}${page}`;
  }
  // console.log('>>>log middleware >>> url.pathname',url.pathname)

  const response = NextResponse.rewrite(url);

  // console.log('>>>log middleware >>> url',url)

  if (language && language === validLang) {
    response.cookies.set(LOCALE_COOKIE, validLang, {
      maxAge: ONE_YEAR
    });
  }

  return response;
};
