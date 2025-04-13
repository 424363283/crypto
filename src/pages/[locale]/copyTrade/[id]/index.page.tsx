import { UniversalLayout } from '@/components/layouts/universal';
// import CopyTradingDetail from '@/components/CopyTrading/CopyTradingDetail';
import { cache, Lang, PAGE_ENV } from '@/core/i18n';
import { useRouter } from '@/core/hooks';
import { getFile } from '@/core/i18n/src/get-static-props';
import { defaultLang, LANGUAGE } from '@/core/i18n/src/constants';
import { getCmcPath } from '@/core/utils/src/get-cmc-path';
import dynamic from 'next/dynamic';
const CopyTradingDetail = dynamic(() => import('@/components/CopyTrading/CopyTradingDetail'), { ssr: false, loading: () => <div /> });
//交易員詳情
function CopyTradingSettingDetail() {
  return (
    <UniversalLayout bgColor="var(--theme-background-color-2)">
      <CopyTradingDetail />
    </UniversalLayout>
  );

}
export default Lang.SeoHead(CopyTradingSettingDetail);
export const getServerSideProps = async (context: any) => {
  const locale = context.params?.locale || defaultLang;
  const id = context.params?.id || '';
  const userType = context.params?.userType || '';
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
    key1: 'copy-traders'
  };

  try {
    const langMap = {
      zh: 'zh_CN',
      en: 'en_US'
    };
    const lang = langMap[locale] || 'zh_CN';
    const url = getCmcPath(`/public/copyTrade/${id}?id=${id}&&userType=${userType}`);
    const response = await fetch(url);
    const resJson = await response.json();
    console.log('resJson', resJson);
    if (resJson.code === 200) {
      console.log('resJson', resJson);
      const detail = resJson.data;
      return { props: { ...props, detail, lang } };
    }
    return { props: { ...props, detail: {}, lang } };
  } catch (error) {
    return { props: { ...props, detail: {}, lang } };
  }
};
