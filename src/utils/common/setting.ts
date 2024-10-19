import { browserLang } from './browser';
import { read, write } from '../cookie';

export function setLangUnit(lang: string, unit: string) {
  // const win: any = window;
  const default_langs = {
    'en-us': 'en-us',
    'zh-cn': 'zh-cn'
  };
  const default_lang = (default_langs as any)[browserLang()] || 'en-us';
  const langList: string[] = [];
  const langText: { [key: string]: any; } = {};
  let _lang = lang || read('locale') || (localStorage.lang ? localStorage.lang.toLowerCase() : browserLang());
  const langDefault = langList[0] ? langList[0] : default_lang;

  // 不在语言列表,默认为en-us;
  if (!_lang || langList.indexOf(_lang) === -1) {
    _lang = langDefault;
  }

  let _unit = unit;
  // unit存在，并且不在语言列表
  if (unit && langList.indexOf(unit) == -1) {
    _unit = _lang;
  }

  localStorage.lang = _lang; // 选择的语言
  localStorage.unit = _unit; // 法币单位
  localStorage.lang_text = langText[_lang];
  write({
    name: 'locale',
    value: _lang,
    domain: location.hostname.replace(location.hostname.split('.').shift() + '.', '')
  });
}

// 红涨绿跌
export function setUpDown(n: number | string) {
  const win: any = window;

  if (Number(n) == 0 || !win.palette || !win.palette.up || !win.palette.down) {
    return;
  }

  if (Number(n) == 1) {
    win.localStorage.up_down = n;
    const tmp = { ...win.palette.up };
    win.palette.up = { ...win.palette.down };
    win.palette.down = tmp;
  }
}
