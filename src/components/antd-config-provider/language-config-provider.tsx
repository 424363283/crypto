import { useAppContext } from '@/core/store';
import { ConfigProvider } from 'antd';
import type { Locale } from 'antd/es/locale';
import { ReactNode } from 'react';

import en_US from 'antd/lib/locale/en_US';
import es_ES from 'antd/lib/locale/es_ES';
import fr_FR from 'antd/lib/locale/fr_FR';
import id_ID from 'antd/lib/locale/id_ID';
import ja_JP from 'antd/lib/locale/ja_JP';
import pt_PT from 'antd/lib/locale/pt_PT';
import ru_RU from 'antd/lib/locale/ru_RU';
import tr_TR from 'antd/lib/locale/tr_TR';
import vi_VN from 'antd/lib/locale/vi_VN';
import zh_TW from 'antd/lib/locale/zh_TW';
import zh_CN from 'antd/lib/locale/zh_CN';

import 'dayjs/locale/en';
import 'dayjs/locale/fr';
import 'dayjs/locale/id';
import 'dayjs/locale/ja';
import 'dayjs/locale/pt';
import 'dayjs/locale/ru';
import 'dayjs/locale/tr';
import 'dayjs/locale/vi';
import 'dayjs/locale/zh-tw';
import 'dayjs/locale/zh-cn';

const languages: { [key: string]: Locale } = {
  zh: zh_CN,
  en: en_US,
  vi: vi_VN,
  ru: ru_RU,
  id: id_ID,
  ja: ja_JP,
  pt: pt_PT,
  tr: tr_TR,
  es: es_ES,
  fr: fr_FR,
  tl: en_US,
};

export const useAntdLocal = () => {
  const { locale: lang } = useAppContext();
  const locale = languages[lang];
  // console.log('locale=',locale);
  return locale;
};

export const AntdLanguageConfigProvider = ({ children }: { children: ReactNode }) => {

  return <ConfigProvider locale={useAntdLocal()}>{children}</ConfigProvider>;
};
