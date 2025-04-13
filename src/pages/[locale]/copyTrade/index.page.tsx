'use client';
import CopyTradingTraders from '@/components/CopyTrading/index';
import { Lang } from '@/core/i18n';
//默认合约跟单
 function CopyTradingPage() {
  return <CopyTradingTraders />;
}

export default Lang.SeoHead(CopyTradingPage);
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ key: 'copy-traders' });