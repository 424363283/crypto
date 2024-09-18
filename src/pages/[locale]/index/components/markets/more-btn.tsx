import { DesktopOrTablet, Mobile } from '@/components/responsive';
import { useResponsiveClsx } from '@/core/hooks/src/use-responsive';
import { TrLink } from '@/core/i18n/src/components/tr-link';
import { LANG } from '@/core/i18n/src/page-lang';
import { clsx } from '@/core/utils/src/clsx';
import { memo } from 'react';
import css from 'styled-jsx/css';

const MoreBtn = ({ tab, children }: { tab: string; children: React.ReactNode }) => {
  const { setResponsiveClsx } = useResponsiveClsx();
  return (
    <div className={clsx('markets-container', setResponsiveClsx('m-pc', 'm-pad', 'm-phone'))}>
      <div className={clsx('more-btn')}>
        <span className='title'>{LANG('Popular cryptocurrencies')}</span>
        <DesktopOrTablet>
          <TrLink className='more-link' href={`/markets`} query={{ tab: tab }}>
            {LANG('查看更多')}
          </TrLink>
        </DesktopOrTablet>
      </div>
      {children}
      <Mobile>
        <TrLink
          className={clsx('more-link', setResponsiveClsx('l-pc', 'l-pad', 'l-phone'))}
          href={`/markets`}
          query={{ tab: tab }}
        >
          {LANG('查看更多')}
        </TrLink>
      </Mobile>
      <style jsx>{styles}</style>
    </div>
  );
};
export default memo(MoreBtn);
const styles = css`
  .markets-container {
    max-width: var(--const-max-page-width);
    margin: 0 auto;
    padding: 30px 0 0;
    .more-btn {
      font-size: 20px;
      font-weight: 600;
      padding: 40px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        color: var(--theme-font-color-1);
        font-size: 46px;
        font-weight: 700;
      }
    }
    :global(.more-link) {
      color: var(--skin-font-color);
      background-color: var(--skin-primary-color);
      display: flex;
      min-width: 150px;
      height: 48px;
      padding: 0 24px;
      justify-content: center;
      align-items: center;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 500;
    }
    &.m-pad {
      padding: 30px 32px 0;
      .title {
        font-size: 36px;
      }
    }
    &.m-phone {
      padding: 30px 16px 0;
      .title {
        font-size: 32px;
      }
      :global(.more-link) {
        margin-top: 15px;
      }
    }
  }
`;
