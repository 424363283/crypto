import { UniversalLayout } from '@/components/layouts/universal';
import { getCmcPath } from '@/core/utils/src/get-cmc-path';
import { getFile } from '@/core/i18n/src/get-static-props';
import { cache, LANG, Lang, PAGE_ENV } from '@/core/i18n';
import { defaultLang, LANGUAGE } from '@/core/i18n/src/constants';
import dynamic from 'next/dynamic';
//交易员PK: /copyTrade/compare/1313-2342-23232-221211
const CopyTradingCompare = dynamic(() => import('@/components/CopyTrading/CopyTradingCompare'), { ssr: false, loading: () => <div /> });
function CopyTradingComparePage() {
  return (
    <UniversalLayout bgColor="var(--theme-background-color-2)">
      <CopyTradingCompare />
    </UniversalLayout>
  );
}
export default Lang.SeoHead(CopyTradingComparePage);
export const getServerSideProps = async (context: any) => {
  const locale = context.params?.locale || defaultLang;
  const id = context.params?.id || '';
  const tq = context.query?.tq || '';
  const gq = context.query?.gq || '';

  const { lang, meta } = await getFile(locale, 'copy-traders');

  cache.lang = lang;
  cache.meta = meta;
  cache.locale = locale;
  cache.locales = Object.keys(LANGUAGE);

  console.log('question id ', id);

  const props = {
    locale: locale,
    locales: cache.locales,
    meta: meta,
    env: PAGE_ENV.PC,
    auth: false,
    robots: true,
    id,
    key1: 'compare'
  };

  try {
    const langMap = {
      zh: 'zh_CN',
      en: 'en_US'
    };

    const lang = langMap[locale] || 'zh_CN';
    const url = getCmcPath(`/public/copyTrade/compare?id=${id}`);
    const response = await fetch(url);
    const resJson = await response.json();
    if (resJson.code === 200) {
      const detail = resJson.data;
      return { props: { ...props, detail, lang } };
    }
    return { props: { ...props, detail: {}, lang } };
  } catch (error) {
    return { props: { ...props, detail: {}, lang } };
  }
};
