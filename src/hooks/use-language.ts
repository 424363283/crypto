'use client';

import { useParams, useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ConfigContext } from '@/context';
import { isServerSideRender } from '@/utils';

export interface Language {
  icon: string;
  jsLoadUrls: Array<string>;
  lang: string;
  label: string;
  prefix: string;
  suffix: string;
  text: string;
  value: string;
}

export function useLanguage(props: Partial<{ selected: string }> = {}) {
  const { selected } = props || {};
  const { locale } = useParams();
  const { appConfig } = useContext(ConfigContext);
  const supportLanguages: Language[] = ((appConfig as any).supportLanguages || []).map((language: Language) => ({
    ...language,
    value: language.lang,
    label: language.text
  }));

  const urlLocale = Array.isArray(locale) ? locale?.[0].toLowerCase?.() : locale?.toLowerCase?.();

  // 1. 服务端渲染直接使用 url 中的 locale 参数
  // 2. 客户端渲染:
  //    a. 检查 localStorage 是否和 url 中是否匹配，优先使用 URL 中的参数;
  //    b. 无 localStorage 则直接使用 url 参数;
  //    c. 使用传入 hooks 的默认值;
  const localLanguage = isServerSideRender()
    ? urlLocale
    : window.localStorage.lang
      ? window.localStorage.lang !== urlLocale
        ? urlLocale
        : window.localStorage.lang
      : urlLocale
        ? urlLocale
        : selected;

  const localUnit = isServerSideRender() ? urlLocale : window.localStorage.unit || 'zh-cn';

  const [current, setLanguage] = useState(localLanguage);
  const [currentUnit, setCurrentUnit] = useState(localUnit);
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const change = useCallback(
    (option: string) => {
      const target = (supportLanguages as Language[]).find(lang => lang.lang === option);
      if (target) {
        const locales = target.lang.split('-');
        const newLocale = `${locales[0]}-${locales[1].toUpperCase()}`;
        const newLang = pathname.replace(new RegExp(urlLocale, 'i'), newLocale);
        setLanguage(option);
        window.localStorage.lang = target.value;
        window.localStorage.lang_text = target.text;
        router.push(search.toString() ? `${newLang}?${search.toString()}` : newLang);
      }
    },
    [urlLocale, pathname, router, supportLanguages]
  );

  const changeUnit = useCallback(
    (option: string) => {
      const target = (supportLanguages as Language[]).find(lang => lang.lang === option);
      if (target) {
        window.localStorage.unit = target.value;
        setCurrentUnit(option);
        window.location.reload();
      }
    },
    [urlLocale, pathname, router, supportLanguages]
  );

  useEffect(() => {
    // const targetConfig = supportLanguages.find((item: any) => item.lang === current);
    // if (targetConfig) {
    //   loadScript(
    //     targetConfig.jsLoadUrls[targetConfig.jsLoadUrls.length - 1],
    //     `bv-${current}`
    //   )
    //     .then(() => {
    //       // updateMessage((window as any).WEB_LOCALES_USER);
    //     });
    // }
    localStorage.unit = localUnit;
    localStorage.lang = localLanguage;
  }, []);


  return {
    change,
    supportLanguages,
    /** 支持的法币 */
    supportCurrency: useMemo(() => {
      if (supportLanguages?.length) {
        return supportLanguages.reduce((results, item) => {
          if (item.lang != 'tr-tr' && item.suffix != 'HKD') {
            results.push({ ...item, label: `${item.prefix} ${item.suffix}` });
          }
          return results;
        }, [] as Language[]);
      }
      return [];
    }, [supportLanguages]),
    language: current,
    changeUnit,
    currentUnit
  };
}
