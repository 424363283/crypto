import { useResponsiveClsx } from '@/core/hooks/src/use-responsive';
import { LANG } from '@/core/i18n/src/page-lang';
import { clsx } from '@/core/utils/src/clsx';
import { MediaInfo } from '@/core/utils/src/media-info';
import { memo } from 'react';
import css from 'styled-jsx/css';

const Tabs = (props: { tab: string; setTab: (tab: string) => void }) => {
  const { tab, setTab } = props;
  const { setResponsiveClsx } = useResponsiveClsx();

  return (
    <ul className='tabs-wrapper'>
      <li
        className={clsx(tab === 'spot' && 'active', setResponsiveClsx('t-pc', 't-pad', 't-phone'))}
        onClick={() => setTab('spot')}
      >
        {LANG('现货')}
      </li>
      <li className={clsx(tab === 'swapUsdt' && 'active')} onClick={() => setTab('swapUsdt')}>
        {LANG('U本位合约')}
      </li>
      <li className={clsx(tab === 'swapCoin' && 'active')} onClick={() => setTab('swapCoin')}>
        {LANG('币本位合约')}
      </li>
      {process.env.NEXT_PUBLIC_LITE_ENABLE === 'true' && (
        <li className={clsx(tab === 'lite' && 'active')} onClick={() => setTab('lite')}>
          {LANG('简易合约')}
        </li>
      )}
      <li className={clsx(tab === 'etf' && 'active')} onClick={() => setTab('etf')}>
        {LANG('杠杆代币')}
      </li>
      <style jsx>{styles}</style>
    </ul>
  );
};

export default memo(Tabs);
const styles = css`
  .tabs-wrapper {
    margin: 0;
    padding: 0 16px;
    display: flex;
    align-items: center;
    /* border-bottom: 1px solid var(--skin-border-color-1); */
    width: 100%;
    overflow-x: auto;
    li {
      padding: 12px 0;
      font-size: 16px;
      font-weight: 500;
      color: var(--theme-font-color-3);
      margin-right: 20px;
      cursor: pointer;
      white-space: nowrap;
      @media ${MediaInfo.desktop} {
        margin-right: 48px;
      }
      &.active {
        /* color: var(--theme-font-color-1); */
        color: var(--newtheme-home-btn-color);
        border-radius: 4px;
        background: var(--skin-primary-color);;
        padding: 4px 24px;
        /* border-bottom: 2px solid var(--skin-color-active); */
      }
    }
  }
`;
