import { isMobile } from './is-mobile';

/**
 * 是否跳转m站
 */
export function shouldChangeVersion() {
  // 搜索引擎
  const spider = /googlebot|spider|bingbot|YandexBot|LinkpadBot|MJ12bot|HeadlessChrome/i.test(
    window.navigator.userAgent
  );

  if (spider) {
    return false;
  }

  // mobile
  // 未主动选择pc版
  return isMobile() && !window.localStorage.keepWeb;
}
