import { LanguageCode } from '../../../../../public/tradingView/charting_library/charting_library';

export function getThemeFromLocalTheme (theme: string) {
  switch (theme) {
    case 'light': return 'Light';
    default: return 'Dark';
  }
}

export function getLangFromLocalLang (lang: string): LanguageCode {
  const langList = [
    'ar',
    'zh_TW',
    'zh',
    'cs',
    'da_DK',
    'nl_NL',
    'en',
    'et_EE',
    'fr',
    'de',
    'el',
    'he_IL',
    'hu_HU',
    'id_ID',
    'it',
    'ja',
    'ko',
    'ms_MY',
    'no',
    'fa',
    'pl',
    'pt',
    'ro',
    'ru',
    'sk_SK',
    'es',
    'sv',
    'th',
    'tr',
    'vi'
  ];

  const [_lang, _area] = lang.split('-');

  const l = langList.includes(`${_lang}_${_area}`) ? `${_lang}_${_area}` : langList.includes(_lang) ? _lang : 'en';

  return l as LanguageCode;
}