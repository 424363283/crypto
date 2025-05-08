import { UniversalLayout } from '@/components/layouts/login/universal';
import { LANG, Lang } from '@/core/i18n';
import { MediaInfo, getUrlQueryParams } from '@/core/utils';
import dynamic from 'next/dynamic';
import css from 'styled-jsx/css';
import { WalletType } from '../components/types';
import Nav from '@/components/nav';
const SwapAnalysis = dynamic(() => import('./components/swap-analysis'), { ssr: false });
const SpotAnalysis = dynamic(() => import('./components/spot-analysis'), { ssr: false });

function PnlAnalysis() {
  const type = getUrlQueryParams('type');
  const renderSpecificCard = () => {
    if (type === WalletType.ASSET_SPOT) {
      return <SpotAnalysis />;
    }
    return <SwapAnalysis />;
  };
  return (
    <UniversalLayout bgColor='var(--theme-background-color-2)' headerBgColor='var(--fill_2)'>
      { <Nav title={LANG('盈亏分析详情')} /> }
      <div className='pnl-analysis-container'>{renderSpecificCard()}</div>
      <style jsx>{styles}</style>
    </UniversalLayout>
  );
}
const styles = css`
  .pnl-analysis-container {
    max-width: var(--const-max-page-width);
    margin: 24px auto;
    width: 100%;
    height: 100%;
    @media ${MediaInfo.mobile} {
      padding: 0 10px;
      margin: 0;
      width: calc(100% - 20px);
    }
    @media ${MediaInfo.tablet} {
      padding: 0 20px;
    }
  }
`;
export default Lang.SeoHead(PnlAnalysis);
export const getStaticPaths = Lang.getStaticPathsOrderHistoryCallback();
export const getStaticProps = Lang.getStaticProps({ auth: true });
