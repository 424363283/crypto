import { DesktopOrTablet, Mobile } from '@/components/responsive';
import { useResponsiveClsx } from '@/core/hooks/src/use-responsive';
import { TrLink } from '@/core/i18n/src/components/tr-link';
import { LANG } from '@/core/i18n/src/page-lang';
import { MediaInfo } from '@/core/utils';
import { clsx } from '@/core/utils/src/clsx';
import { memo } from 'react';
import css from 'styled-jsx/css';

const MoreBtn = ({ children }: { children: React.ReactNode }) => {
  const { setResponsiveClsx } = useResponsiveClsx();
  return (
    <div className={clsx('markets-container', setResponsiveClsx('m-pc', 'm-pad', 'm-phone'))}>
      <div className={clsx('market-title')}>
        <h2 className="title">{LANG('Popular cryptocurrencies')}</h2>
        <p>{LANG('一键买币, 方便快捷, 永续合约')}</p>
      </div>
      {children}
      <style jsx>{styles}</style>
    </div>
  );
};
export default memo(MoreBtn);
const styles = css`
  .markets-container {
    width: 1200px;
    margin: 0 auto;
    padding: 0 0 60px;
    @media ${MediaInfo.mobile} {
      width: 100%;
      padding: 0 24px 24px;
      box-sizing: border-box;
      :global(.favors-list-wrapper) {
        width: 100%;
        padding: 0;
      }
    }
  }
  .market-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 80px 0 46px;
    @media ${MediaInfo.mobile} {
      padding: 24px 0;
    }
    h2 {
      color: var(--text_1);
      font-size: 32px;
      font-weight: 700;
      white-space: nowrap;
      @media ${MediaInfo.mobile} {
        font-size: 24px;
      }
    }
    p {
      color: var(--text_3);
      font-size: 16px;
      font-weight: 400;
      text-align: center;
    }
  }
`;
