import React, { FC, useEffect, useState } from 'react'
import ClientConfig from "@/client.config";
import Head from "next/head";
import { Router } from "next/router";
import { TDK } from "@/components/layout/tdk";
import { TDKNew } from "@/components/layout/tdkNew";
import { ELanguage, IBookItem } from "@/typings/home.interface";
import Script from "next/script";
import { useTranslation } from "next-i18next";

const { googleCode } = ClientConfig;

export const pathnameData = {
  browse: '/browse',
  more: '/more/[position]',
  book: process.env.Platform === 'dramabox' ? '/drama/[bookId]' : '/film/[bookId]',
  episode: process.env.Platform === 'dramabox' ? '/video/[bookId]' : '/episode/[bookId]',
  download: '/download',
  error404: '/404',
  error500: '/500',
  agreementPrivacy: '/privacy',
  agreementUser: '/terms',
  tag: '/tag/[keywordId]',
  keywords: '/keywords'
}

const HeadNormal: FC<any> = ({ pageProps = {}, router }: { pageProps: any; router: Router }) => {

  const { t } = useTranslation()
  const getTdk = (): { title: string; keywords: string; description: string; } => {
    const _locale = (router.locale && Object.values(ELanguage).includes(router.locale as ELanguage) ? router.locale : ELanguage.English) as ELanguage;

    const tdkData = process.env.Platform === 'dramabox' ? TDKNew : TDK;

    // @ts-ignore
    if (!tdkData[_locale]) {
      return tdkData[ELanguage.English].index;
    }
    if (router.pathname === '/') {
      return tdkData[_locale].index
    } else if (router.pathname.includes('/more/[position]')) {
      const positionName = t(pageProps.positionName) || '';
      return tdkData[_locale].more({ ...router.query, positionName })
    } else if (router.pathname.includes('/browse')) {
      const  _typeTwoName = pageProps.typeTwoId === 0 ? t(`browse.all`) : pageProps.typeTwoName;
      return tdkData[_locale].browse({ ...router.query, typeTwoName: _typeTwoName })
    } else {
      try {
        for(const item in pathnameData) {
          // @ts-ignore
          if (router.pathname.includes(pathnameData[item]) && tdkData[_locale] && tdkData[_locale][item]) {
            // @ts-ignore
            const tdkItem = tdkData[_locale][item]
            return typeof tdkItem === 'function' ? tdkItem({ ...router.query, ...pageProps }) : tdkItem
          }
        }
      } catch (e) {
        return tdkData[_locale].index;
      }
    }
    return tdkData[_locale].index;
  }
  const [pageTdk, setPageTdk] = useState(() => getTdk());

  useEffect(() => {
    setPageTdk(getTdk())
  },[router, router.locale, t]); // eslint-disable-line

  const getUrl = (lan = ELanguage.English) => {
    const _locale = lan === ELanguage.English ? '' : `/${lan}`
    const _asPath = router.asPath === '/' ? '' : router.asPath
    return (process.env.Platform === "dramabox" ? 'https://www.dramabox.com' : 'https://www.dramaboxapp.com') +_locale + _asPath;
  }

  // 拓展多语言字段
  const AlternateLink = () => {
    if (router.pathname.includes(pathnameData.tag) || router.pathname.includes(pathnameData.keywords)) return null;

    if (router.pathname.includes(pathnameData.book)) {
      return <>
        {pageProps.languages && pageProps.languages.length > 0 && pageProps.languages.map((lanUrl: ELanguage) => {
          return <link key={lanUrl} rel="alternate" hrefLang={lanUrl} href={getUrl(lanUrl)}/>
        })}
      </>
    } else {
      return <>
        <link rel="alternate" hrefLang={ELanguage.English} href={getUrl(ELanguage.English)}/>
        <link rel="alternate" hrefLang={ELanguage.ZhHans} href={getUrl(ELanguage.ZhHans)}/>
        <link rel="alternate" hrefLang={ELanguage.Zh} href={getUrl(ELanguage.Zh)}/>
        <link rel="alternate" hrefLang={ELanguage.Korean} href={getUrl(ELanguage.Korean)}/>
        <link rel="alternate" hrefLang={ELanguage.Spanish} href={getUrl(ELanguage.Spanish)}/>
      </>
    }
  }
  // 分享
  const ShareMate = () => {
    const locationUrl = getUrl(router.locale as ELanguage);
    if (router.pathname.includes(pathnameData.book) || router.pathname.includes(pathnameData.episode)) {}
    const { bookInfo = {} as IBookItem } = pageProps;
    return <>
      <meta key="fb_app_id" property="fb:app_id" content={ClientConfig.fbAppId}/>
      <meta key="og_url" property="og:url" content={locationUrl}/>
      <meta key="og_title" property="og:title" content={pageTdk.title || ClientConfig.name}/>
      <meta key="og_description" property="og:description" content={pageTdk.description || ""}/>
      <meta key="og_image" property="og:image" content={bookInfo.cover || (process.env.WebDomain + "/images/logo.png")}/>
      <meta key="og_image_alt" property="og:image:alt" content={bookInfo.bookName || ClientConfig.name}/>
      <meta key="og_site_name" property="og:site_name" content={ClientConfig.name}/>
      <meta key="og_type" property="og:type" content="website"/>
      {/*twitter分享*/}
      <meta key="twitter_url" property="twitter:url" content={locationUrl}/>
      <meta key="twitter_title" name="twitter:title" content={pageTdk.title || ClientConfig.name}/>
      <meta key="twitter_description" name="twitter:description" content={pageTdk.description || ""}/>
      <meta key="twitter_site" name="twitter:site" content={locationUrl}/>
      <meta key="twitter_card" name="twitter:card" content="summary"/>
      <meta key="twitter_image" name="twitter:image" content={bookInfo.cover || (process.env.WebDomain + "/images/logo.png")}/>
    </>
    // return null;
  }

  return <>
    <Head>
      <title>{pageTdk.title || ClientConfig.name}</title>
      <meta key="keywords" name="keywords" content={pageTdk.keywords}/>
      {pageTdk.description ? <meta key="description" name="description" content={pageTdk.description}/> : null}
      <meta key="httpEquiv" httpEquiv="X-UA-Compatible" content="IE=edge"/>
      <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"/>
      {/*防止xss攻击*/}
      <meta key="httpEquiv2" httpEquiv="Content-Security-Policy"/>
      {/*Sets whether a web application runs in full-screen mode.*/}
      <meta key={'ios_web'} name="apple-mobile-web-app-capable" content="yes" />
      <link rel="icon" href={'/favicon.ico'}/>
      <link rel="canonical" href={getUrl(router.locale as ELanguage)}/>
      <AlternateLink />
      <ShareMate />
    </Head>
    {/* Global Site Tag (gtag.js) - Google Analytics */}
    <Script
      id={'google_sdk'}
      strategy={'afterInteractive'}
      dangerouslySetInnerHTML={{
        __html: `!function(f,b,e,v,n,t,s){
    t=b.createElement(e);
    t.defer=!0;
    t.src=v;
    s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://www.googletagmanager.com/gtag/js?id=${googleCode}');
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', '${googleCode}');`,
      }}
    />
  </>
}

export default HeadNormal;


