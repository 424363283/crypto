import { getWindow } from './get';

function isNumber(val: any) {
  return typeof val === 'number' || (typeof val === 'string' && !isNaN(parseFloat(val)));
}

function isSafeValue(val: any, avoid: any) {
  if (avoid) {
    return val !== undefined && val !== null && val !== '' && val !== 'null';
  }
  return val !== undefined && val !== null;
}

/**
 * 判断值是否为false
 * @param {any} data - 需要验证的值
 */
const isEmpty = (data: any) => {
  if (Array.isArray(data)) {
    // 过滤成员是否为空
    if (!data.filter(Boolean).length) {
      return false;
    } else {
      return !!data.length && data;
    }
  } else {
    if (!data || data === 'undefined' || data === 'null' || data === 'NaN' || data === 'false' || (typeof data === 'object' && !Object.keys(data).length)) {
      return false;
    } else {
      return data;
    }
  }
};
const isBrowser = typeof window !== 'undefined';
const userAgent = isBrowser ? navigator.userAgent : '';
const isAndroid = isBrowser && /Android/.test(userAgent);
const isFirefox = isBrowser && /Firefox/.test(userAgent);

const isTablet = (isBrowser && /iPad|PlayBook/.test(userAgent)) || (isAndroid && !/Mobile/.test(userAgent)) || (isFirefox && /Tablet/.test(userAgent));
const isPhone = isBrowser && /iPhone/.test(userAgent) && !isTablet;

// 数字是否科学计数法
const isScientificNotation = (number: any) => {
  return /e/i.test(number + '');
};

/**
 * 是否是交易页面
 * @param pathname? string
 */
// 是否永续模拟盘
const isSwapDemo = (pathname?: string) => /(\/swap\/demo|\/swap-info\/demo|order-history\/demo)/.test(pathname || getWindow().location?.pathname);
// 是否是永续模拟交易页面
const isSwapDemoTradePage = (pathname?: string) => /\/swap\/demo/.test(pathname || getWindow().location?.pathname);
// 是否是交易页面
const isTradePage = (pathname?: string) => /\/(spot|swap|lite)\//.test(pathname || window.location.pathname);
// 是否是lite交易页面
const isLiteTradePage = (pathname?: string) => /\/lite\//.test(pathname || window.location.pathname);
/**
 * 是否是Spot交易页面
 * @param pathname? string
 * @returns
 */
const isSpotTradePage = (pathname?: string) => /\/spot\//.test(pathname || window.location.pathname);

/**
 * 是否是swap永续交易页面
 * @param pathname? string
 * @returns
 */
const isSwapTradePage = (pathname?: string) => /\/swap/.test(pathname || window.location.pathname);
// 是否是永续模拟盘
const isSwapSL = (id: string): boolean => {
  return /^S.*-SUSD(T)?$/i.test(id);
};
// 是否是永续模拟盘USDT本位
const isSwapSLUsdt = (id: string): boolean => {
  return /^S.*-SUSDT$/i.test(id);
};
// 是否是永续模拟盘币本位
const isSwapSLCoin = (id: string): boolean => {
  return /^S.*-SUSD$/i.test(id);
};
/**
 * 是否是现货
 * @param id string
 * @returns boolean
 */
const isSpot = (id: string): boolean => {
  return /_/i.test(id);
};
/**
 * 是否是永续
 * @param id string
 * @returns boolean
 */
const isSwap = (id: string): boolean => {
  return /-/i.test(id);
};
/**
 * 是否是USDT本位
 * @param id string
 * @returns boolean
 */
const isSwapUsdt = (id: string): boolean => {
  return /-usdt$/i.test(id);
};
/**
 * 是否是币本位
 * @param id string
 * @returns boolean
 */
const isSwapCoin = (id: string): boolean => {
  return /-usd$/i.test(id);
};
/**
 * 是否是现货ETF
 * @param id string
 * @returns boolean
 */
const isSpotEtf = (id: string): boolean => {
  return /\d+(L|S)_/i.test(id);
};
/**
 * 是否是现货币币
 * @param id string
 * @returns boolean
 */
const isSpotCoin = (id: string): boolean => {
  return /_/i.test(id) && !isSpotEtf(id);
};
/**
 *  是否是简单合约
 * @param id string
 * @returns boolean
 */
const isLite = (id: string): boolean => {
  return !isSpot(id) && !isSwap(id);
};

export { isAndroid, isBrowser, isEmpty, isLite, isLiteTradePage, isNumber, isPhone, isSafeValue, isScientificNotation, isSpot, isSpotCoin, isSpotEtf, isSpotTradePage, isSwap, isSwapCoin, isSwapDemo, isSwapDemoTradePage, isSwapSL, isSwapSLCoin, isSwapSLUsdt, isSwapTradePage, isSwapUsdt, isTablet, isTradePage };
