// import { TELEGRAM } from '@/core/shared/src/constants/link';
import { getCookie } from './cookie';
import { isAndroid, isBrowser, isPhone } from './is';

export const getWindow = () => (isBrowser ? window : {}) as any;

// 获取地址栏参数
export const getUrlQueryParams = (key: string) => {
  if (!isBrowser) return '' as any;
  const params = new URLSearchParams(getWindow()?.location?.search);
  return params.get(key);
};

export const getCurrencyDigit = (code: string) => {
  const usdtType = getUrlQueryParams('type');
  const digit = usdtType === 'swap-u' || usdtType === 'USDT' || code.toUpperCase() === 'USDT' ? 2 : 8;
  return digit;
};

let upload = 'https://y-mex-upload.pages.dev/icons/';

export const getCryptoIcon = (code: string) => {
  if (typeof code !== 'string') return;
  let key = code.toUpperCase().replace(/3L|3S/g, '');
  if (/1000SHIB/i.test(key)) {
    key = 'SHIB';
  } else if (/1000LUNC/i.test(key)) {
    key = 'LUNC';
  }

  return upload + key.toLocaleLowerCase() + '.png';
};

export const getUUID = (len: number = 32): string => {
  let uid = '';
  const seed = '0Aa1Bb2Cc3Dd4Ee5Ff6Gg7Hh8Ii9Jj0Kk1Ll2Mm3Nn4Oo5Pp6Qq7Rr8Ss9Tt0Uu1Vv2Ww3Xx4Yy5Zz6789';
  while (len-- > 0) {
    uid += seed[(Math.random() * seed.length) | 0];
  }
  return uid;
};
// 获取邀请码参数
export const getRuParam = () => {
  if (typeof document === 'undefined') return '';
  const search = window.location.search;
  const params = new URLSearchParams(search);
  let ru = params.get('ru');
  if (ru) {
    const index = ru.indexOf('=');
    if (index !== -1) {
      ru = ru.substring(0, index);
    }
  } else {
    ru = getCookie('ru');
  }

  return ru;
};
// 获取渠道码参数
export const getFParam = () => {
  if (typeof document === 'undefined') return '';
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const f = params.get('f') || getCookie('f');
  return f;
};
// 获取社区链接
export const getCommunityLink = (type: string) => {
  const locale = document.documentElement.lang;
  return {
    // telegram: TELEGRAM[locale] || TELEGRAM['en'],
    instagram: 'https://www.instagram.com/y-mex_official/',
    twitter: 'https://twitter.com/YMEX',
    youtube: 'https://www.youtube.com/@YMEXOfficial',
    linkedin: 'https://www.linkedin.com/company/y-mex',
  }[type?.toLocaleLowerCase()];
};
export const getPlatform = (): string => {
  if (typeof document === 'undefined') return '';
  const userAgent = navigator.userAgent;
  const isWindowsPhone = /Windows Phone/.test(userAgent);
  const isSymbian = /SymbianOS/.test(userAgent) || isWindowsPhone;
  const isDesktop = !isPhone && !isAndroid && !isSymbian;

  // if (isDesktop) {
  //   return 'pc';
  // } else {
  //   return 'h5';
  // }
  return 'web';
};
export const getActive = (result: boolean) => {
  return result ? 'active' : '';
};

export const getEtfCryptoInfo = (code: string) => {
  const RegExp = /.+\d+[LS]{1}/i;
  const isEtf = RegExp.test(code);
  let lever = 0;
  let isBuy = true;
  let commodity = '';

  if (isEtf) {
    commodity = RegExp.exec(code)?.[0] || '';
    lever = Number(/(\d+)[LS]/.exec(code)?.[1]);
    lever = Number.isNaN(lever) ? 0 : lever;
    isBuy = /.+\d+[L]{1}/i.test(code);
  }

  return { isEtf, isBuy, lever, commodity };
};
// export const getEnv = () => {
//   if (!isBrowser) return '';
//   // 检查是否是 bydtms 域名
//   const url = window.location.host;
//   if (url.includes('bydtms')) {
//     return url.split('.')[0]; // 'new-bipc-2'
//   }
//   // y-mex.com 返回 production
//   if (url.includes('y-mex.com')) {
//     return 'production';
//   }

//   return 'development';
// };
export function getLastPathname(): string | null {
  try {
    const url = getWindow()?.location.href;
    const urlObject = new URL(url);
    const pathname = urlObject.pathname;
    const pathArray = pathname.split('/');
    const lastPathname = pathArray[pathArray.length - 1];
    return lastPathname;
  } catch (error) {
    // 处理URL无效的情况
    console.error('Invalid URL:', error);
    return null;
  }
}
export const getFirstPathAfterLocale = (path: string) => {
  if (path) {
    return '/' + path.split('/')?.[2];
  }
  return path;
};


export const getLocaleFromPath = (path: string) => {
  if (path) {
    return '/' + path.split('/')?.[1];
  }
  return path;
};


 

export const getLocation = () => {
  return getWindow()?.location || {};
};
