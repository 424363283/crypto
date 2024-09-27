import { SUBSCRIBE_TYPES, useWs } from '@/core/network/src/hooks/use-ws';
import { isTradePage } from '@/core/utils/src/is';
import { NextSeo, WebPageJsonLd } from 'next-seo';
import { useRouter } from 'next/router';
import React, { useCallback, useRef, useState } from 'react';
import { PAGE_ENV } from './cache';

// 接管页面的head
export const SeoHead = (Component: React.ComponentType) => {
  const HeadComponent = (props: any) => {
    const { meta, env, locales, locale, auth, robots, id, key1, copyTradingName } = props || {};

    console.log('metametameta',meta)

    const getCoin = useCallback((id: string) => (id || '')?.replace(/-|_/, '')?.toUpperCase(), []);
    const getTitle = useCallback((title: string) => `%s | ${meta.title?.trim() || ''}`.replace('%s', title), []);
    const getDescription = useCallback((coin: string) => meta.description?.replace(/\{coin\}/g, coin), []);
    const getKeywords = useCallback((coin: string) => meta.keywords?.replace(/\{coin\}/g, coin), []);

    const [{ title, coin }, setTitle] = useState<{ title: string; coin: string }>(() => {
      const coin = getCoin(id);
      if (isTradePage(`/${key1}/`) && id) {
        return {
          title: getTitle(coin),
          coin,
        };
      }
      // 带单员详情页 title 已知的填充
      if (key1?.includes('copy-trading/user') && id && copyTradingName) {
        return {
          title: getTitle(copyTradingName),
          coin,
        };
      }
      return {
        title: meta && meta.title?.trim() || '',
        coin,
      };
    });
    const ref = useRef<string>('');
    const { route, query = {} } = useRouter();

    // 订阅ws 最新价显示title
    useWs(
      SUBSCRIBE_TYPES.ws4001,
      (data) => {
        if (isTradePage(route)) {
          const { price, id } = data;
          const coin = getCoin(id);
          if (ref.current === price) return;
          ref.current = price;
          if (price == '--') {
            setTitle({ title: getTitle(coin), coin });
          } else {
            setTitle({ title: getTitle(`${price} | ${coin}`), coin });
          }
        }
      },
      [],
      true
    );

    const getHref = useCallback(
      (locale: string) => {
        const id = (query.id as string)?.toLowerCase() || '';
        const _page = route
          .replace('[locale]', locale)
          .replace('[id]', id)
          .replace('[theme]', query.theme as string);
        return process.env.NEXT_PUBLIC_BASE_URL + _page;
      },
      [query.id, query.theme]
    );


    return (
      <>
        <NextSeo
          title={title}
          description={getDescription(coin)}
          noindex={!robots || env === PAGE_ENV.H5 || auth}
          nofollow={!robots || env === PAGE_ENV.H5 || auth}
          canonical={getHref(locale)}
          languageAlternates={[
            ...locales.map((locale: string) => ({ hrefLang: locale, href: getHref(locale) })),
            {
              hrefLang: 'x-default',
              href: getHref('en'),
            },
          ]}
          twitter={{
            handle: process.env.NEXT_PUBLIC_APP_NAME,
            site: process.env.NEXT_PUBLIC_APP_NAME,
            cardType: 'summary_large_image',
          }}
          additionalMetaTags={[
            {
              name: 'keywords',
              content: getKeywords(coin),
            },
            {
              name: 'google',
              content: 'notranslate',
            },
            {
              name: 'google-site-verification',
              content: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
            },
            {
              name: 'yandex-verification',
              content: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
            },
            {
              name: 'naver-site-verification',
              content: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION,
            },
            {
              name: 'zd-site-verification',
              content: process.env.NEXT_PUBLIC_ZD_SITE_VERIFICATION,
            },
            {
              name: 'viewport',
              content: 'width=device-width,initial-scale=1.0',
            },
            {
              name: 'renderer',
              content: 'webkit',
            },
            {
              name: 'application-name',
              content: process.env.NEXT_PUBLIC_APP_NAME,
            },
            {
              name: 'author',
              content: process.env.NEXT_PUBLIC_APP_NAME,
            },
            {
              name: 'copyright',
              content: process.env.NEXT_PUBLIC_APP_NAME,
            },
            {
              name: 'format-detection',
              content: 'telephone=no,email=no,address=no',
            },
            {
              httpEquiv: 'x-ua-compatible',
              content: 'IE=edge; chrome=1',
            },
          ]}
          additionalLinkTags={[
            {
              rel: 'icon',
              href: process.env.NEXT_PUBLIC_BASE_URL + '/favicon.ico',
            },
          ]}
          openGraph={{
            url: getHref(locale),
            type: 'website',
            title: title,
            description: getDescription(coin),
            locale: locale,
            siteName: process.env.NEXT_PUBLIC_APP_NAME,
            images: [
              {
                url: process.env.NEXT_PUBLIC_BASE_URL + '/og_img.jpg?v=' + process.env.NEXT_PUBLIC_BUILD_TIME,
                width: 1200,
                height: 630,
                alt: process.env.NEXT_PUBLIC_APP_NAME,
                type: 'image/jpg',
              },
            ],
          }}
        />
        <WebPageJsonLd description={getDescription(coin)} id={getHref(locale)} lastReviewed={process.env.NEXT_PUBLIC_BUILD_TIME} />
      </>
    );
  };

  return (props: any) => {
    return (
      <>
        <HeadComponent {...props} />
        { <Component {...props} /> }
      </>
    );
  };
};
