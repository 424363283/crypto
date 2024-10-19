/**
 * @desc 'en-us', 'zh-cn', 'zh-hk', 'ko-kr', 'ja-jp', 'ru-ru', 'de-de','es-es','fr-fr','th-th','vi-vi','tr-tr'
 * @returns {string} browser language
 */
export function browserLang() {
  const ls = navigator.languages ? navigator.languages.length : 0;
  // let res = (ls ? navigator.languages[0] : navigator.language || navigator?.userLanguage).toLowerCase();
  let res = (ls ? navigator.languages[0] : navigator.language || navigator?.language).toLowerCase();

  // es, es-us, es-mx,es-gt等等西班牙语，统一使用 es
  if (/^es-?/.test(res)) {
    res = 'es-es';
  }

  return res;
}

// 检测浏览器缩放比例
export function detectZoom() {
  return window.outerWidth / window.innerWidth;
}
