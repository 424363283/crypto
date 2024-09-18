import { cache } from './cache';
import { getAcceptLanguage, getLanguageHelp, getLanguageMap } from './constants';
import {
  getStaticPaths,
  getStaticPathsTV,
  getStaticPathsFollowerCallback,
  getStaticPathsLiteHistoryOrderCallback,
  getStaticPathsOrderHistoryCallback,
  getStaticPathsSpotHistoryOrderCallback,
  getStaticPathsSwapHistoryOrderCallback,
  getStaticPathsTheme,
  getStaticPathsTradeCallback,
  getStaticPathsUserInfoCallback,
} from './get-static-paths';
import { getStaticProps } from './get-static-props';
import { SeoHead } from './seo-head';

export class Lang {
  public static getLanguageMap = getLanguageMap;
  public static getLanguageHelp = getLanguageHelp;
  public static getAcceptLanguage = getAcceptLanguage;
  public static getStaticPaths = getStaticPaths;
  public static getStaticPathsTV = getStaticPathsTV;
  
  public static getStaticPathsTheme = getStaticPathsTheme;
  public static getStaticPathsTradeCallback = getStaticPathsTradeCallback;
  public static getStaticPathsFollowerCallback = getStaticPathsFollowerCallback;
  public static getStaticProps = getStaticProps;
  public static getStaticPathsUserInfoCallback = getStaticPathsUserInfoCallback;
  public static getStaticPathsLiteHistoryOrderCallback = getStaticPathsLiteHistoryOrderCallback;
  public static getStaticPathsSwapHistoryOrderCallback = getStaticPathsSwapHistoryOrderCallback;
  public static getStaticPathsSpotHistoryOrderCallback = getStaticPathsSpotHistoryOrderCallback;
  public static getStaticPathsOrderHistoryCallback = getStaticPathsOrderHistoryCallback;
  public static SeoHead = SeoHead;
}
export const LANG = (key: string, params?: object): string => {
  let value = '';
  if (typeof window !== 'undefined') {
    const appLang = window.appLang ;
    const commonAppLang = window.commonAppLang;
    const taskLang = window?.taskLang;
    const tradeUiLang = window?.tradeUiLang;
    const currentLang = Object.assign({}, taskLang, appLang, tradeUiLang, commonAppLang);
    value = currentLang?.[key] || `*${key}`;
  } else {
    value = cache.lang?.[key] || `*${key}`;
  }
  if (params) {
    for (let [key, val] of Object.entries(params)) {
      value = value.replace(RegExp(`{${key}}`, 'g'), val);
    }
  }
  return value;
};
