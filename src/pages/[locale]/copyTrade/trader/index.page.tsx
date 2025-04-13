import { UniversalLayout } from '@/components/layouts/universal';
import CopyTradingDetail from '@/components/CopyTrading/CopyTradingDetail';
import { Lang } from '@/core/i18n';
//交易員詳情
 function CopyTradingTradeSetting() {
  return (
    <UniversalLayout bgColor="var(--theme-background-color-2)">
      <CopyTradingDetail />
    </UniversalLayout>
  );
}

export default Lang.SeoHead(CopyTradingTradeSetting);
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ key: 'copy-traders' });