
import fs from 'fs'; 
import path from 'path';
import { LANGUAGE } from './constants';
import { cache, PAGE_ENV } from './cache';
import { defaultLang } from './constants';
import { GetStaticProps, MetaKey } from '../types';

/**
 * @param noindex 参数默认为seo 就是seo页面，都索引。一旦页面自己定义了noindex false，就不索引
 */
export const getStaticProps = ({
  key = MetaKey.index,
  auth = false,
  env = PAGE_ENV.PC,
  robots = true,
}: Partial<GetStaticProps>) => {
    return async (context: any) => {
    // console.log(context.params,'getStaticProps context.params');

    const locale = context.params?.locale || defaultLang;
    const id = context.params?.id || '';

    // console.log(locale,key,'await getFile ');

    const { lang, meta } = await getFile(locale, key);
    // console.log(locale, defaultLang,lang,meta,'getStaticProps 11111');
    
    cache.lang = lang;
    cache.meta = meta;
    cache.locale = locale;
    cache.locales = Object.keys(LANGUAGE);
    cache.env = env;
    // let copyTradingName = '';
    // if (key?.includes('copy-trading/user')) {
    //   const names = require(`./follower/names.json`);
    //   copyTradingName = names[id] || '';
    // }
    return {
      props: {
        locale: cache.locale,
        locales: cache.locales,
        meta: cache.meta,
        env: cache.env,
        auth,
        robots,
        id,
        key1: key,
        // copyTradingName,
      },
    };
  };
};
function getFirstSegment(str: string) {
  // 使用正则表达式匹配字符串开始到第一个 '/' 之前的部分
  const match = str.match(/^[^\/]+/);
  return match ? match[0] : str;
}
const getFilePath = (locale: string, subPath: string) => {
  return path.join(process.cwd(), 'public', 'static', 'locales', locale, subPath);
};
const generateLang = (langPath: string, symbol: string) => {
  let string = fs.readFileSync(langPath, 'utf8');
  string = string.replace(`var ${symbol} =`, '');
  const lang = new Function('return ' + string)();
  return lang;
  return;
};
export const getFile = async (locale: string, key: MetaKey) => {
  // 加载语言文件
  // https://www.y-mex.com/static/locales/zh/index.js
  const langPath = getFilePath(locale, `${getFirstSegment(key)}.js`);
  //console.log(langPath,'getFile langPath');

  // https://www.y-mex.com/static/locales/zh/common-lang.js
  const commonLangPath = getFilePath(locale, 'common-lang.js');
  // 
  const remoteTaskLangPath = getFilePath(locale, 'new-remote-task.js');
  const tradeUiLangPath = getFilePath(locale, 'trade-ui-lang.js');

  const lang = generateLang(langPath, 'appLang');
  const remoteTaskLang = generateLang(remoteTaskLangPath, 'taskLang');
  const commonLang = generateLang(commonLangPath, 'commonAppLang');
  const tradeUiLang = generateLang(tradeUiLangPath, 'tradeUiLang');
  // 动态导入 meta 文件
  const metaModule = await import(`./meta/${locale}.js`);
  //console.log(metaModule.default[key], 'getFile metaModule.default meta');
  const meta = metaModule.default[key] || {};
  return {
    lang: Object.assign({}, remoteTaskLang, lang, tradeUiLang, commonLang) as { [key: string]: string },
    meta,
  };
};
