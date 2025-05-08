import PerpetualInfoContent from '@/components/swap-info-content';
import { useRouter } from '@/core/hooks';
import { Lang } from '@/core/i18n';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import Exponent from './exponent';
import ProtectionFund from './protection-fund';
import RateHistory from './rate-history';
import Rates from './rates';

export const SwapInfo = ({ isSwapDemo }: { isSwapDemo?: boolean }) => {
  const { query }: any = useRouter();
  const { page } = query;
  const [tab, setTab] = useState(page || '0');

  useEffect(() => {
    setTab(page);
  }, [page]);

  return (
    <PerpetualInfoContent isSwapDemo={isSwapDemo} setTab={setTab} tab={tab}>
      {tab === '0' && <Rates />}
      {tab === '1' && <RateHistory />}
      {tab === '2' && <ProtectionFund />}
      {tab === '3' && <Exponent />}
      <style jsx>{styles}</style>
    </PerpetualInfoContent>
  );
};

const styles = css`
  :global(.swap-info-content) {
    :global(.bottom-pagination) {
      padding: 15px 0px !important;
    }

    :global(.common-table) {
      :global(tr) {
        border: none !important;
      
      }
      :global(th) {
        color: var(--text_3) !important;
      }
      :global(tr),
      :global(th),
      :global(td) {
        background: var(--theme-background-color-3-2) !important;
      
        border-color: var(--theme-border-color-1) !important;
        &::before {
          display: none !important;
        }
      }
    }
    :global(th),
    :global(td) {
      &:nth-child(1) {
        padding-left: 0px !important;
      }
      &:last-child {
        text-align: right !important;
        padding-right: 0px !important;
      }
    }
  }
`;

export default Lang.SeoHead(SwapInfo);
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ key: 'swap-info' });
