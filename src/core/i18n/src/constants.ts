//
export const defaultLang = 'zh';

export const LANGUAGE = {
  zh: 'zh',
  en: 'en',
  vi: 'vi',
  ru: 'ru',
  id: 'id',
  ja: 'ja',
  pt: 'pt',
  tr: 'tr',
  es: 'es',
  fr: 'fr',
  tl: 'tl',
  th: 'th',
  ko: 'ko',
  'en-ae': 'en-ae',
  'en-za': 'en-za',
  'en-gb': 'en-gb',
  'en-in': 'en-in',
  'en-kz': 'en-kz',
  de: 'de',
  da: 'da',
  it: 'it',
  pl: 'pl',
} as { readonly [key: string]: string };

export const getLanguageMap = {
  [LANGUAGE.en]: 'English',
  // [LANGUAGE.ko]: '한국어',
  [LANGUAGE.vi]: 'Tiếng Việt',
  [LANGUAGE.ru]: 'Русский',
  [LANGUAGE.id]: 'Bahasa',
  [LANGUAGE.ja]: '日本語',
  [LANGUAGE.pt]: 'Português',
  [LANGUAGE.tr]: 'Türkçe',
  [LANGUAGE.es]: 'Español',
  [LANGUAGE.fr]: 'Français',
  [LANGUAGE.th]: 'ไทย',
  [LANGUAGE.tl]: 'Tagalog',
  [LANGUAGE.zh]: '简体中文',
  [LANGUAGE['zh-TW']]: '繁體中文',
  [LANGUAGE['en-ae']]: 'English(UAE)',
  [LANGUAGE['en-za']]: 'English(Africa)',
  [LANGUAGE['en-gb']]: 'English(UK)',
  [LANGUAGE['en-in']]: 'English(India)',
  [LANGUAGE['en-kz']]: 'English(Kazakhstan)',
  [LANGUAGE.de]: 'German',
  [LANGUAGE.da]: 'Dansk',
  [LANGUAGE.it]: 'Italiano',
  [LANGUAGE.pl]: 'Polski',
};

export const getLanguageHelp = (locale: string) => {
  return (
    {
      [LANGUAGE.zh]: 'zh-cn', // 中文
      [LANGUAGE['zh-TW']]: 'zh-tw', // 中文
      [LANGUAGE.vi]: 'vi', // 越南
      [LANGUAGE.id]: 'id-id', // 印尼
      [LANGUAGE.ru]: 'ru', // 俄罗斯
      [LANGUAGE.ja]: 'ja', // 日文
      [LANGUAGE.pt]: 'pt-pt', // 葡萄牙
    }[locale] || 'en-us'
  );
};

export const getAcceptLanguage = (locale: string) => {
  return {
    [LANGUAGE.zh]: 'zh-CN',
    [LANGUAGE['zh-TW']]: 'zh-TW',
    [LANGUAGE.en]: 'en-US',
    [LANGUAGE.vi]: 'vi-VN',
    [LANGUAGE.ru]: 'ru-RU',
    [LANGUAGE.id]: 'in-ID',
    [LANGUAGE.ja]: 'ja-JP',
    [LANGUAGE.pt]: 'pt-PT',
    [LANGUAGE.tr]: 'tr-TR',
    [LANGUAGE.es]: 'es-ES',
    [LANGUAGE.fr]: 'fr-FR',
    [LANGUAGE.tl]: 'tl-TL',
    [LANGUAGE.th]: 'th-TH',
    [LANGUAGE.ko]: 'ko-KR',
    [LANGUAGE['en-ae']]: 'en-AE',
    [LANGUAGE['en-za']]: 'en-ZA',
    [LANGUAGE['en-gb']]: 'en-GB',
    [LANGUAGE['en-in']]: 'en-IN',
    [LANGUAGE['en-kz']]: 'en-KZ',
    [LANGUAGE.de]: 'de-DE',
    [LANGUAGE.da]: 'da-DK',
    [LANGUAGE.it]: 'it-IT',
    [LANGUAGE.pl]: 'pl-PL',
  }[locale];
};
