import { LANG } from '@/core/i18n/src/page-lang';
import { clsx } from '@/core/utils/src/clsx';
import { memo } from 'react';
import { Input } from 'antd';
import css from 'styled-jsx/css';
import { MediaInfo } from '@/core/utils';
import YIcon from '@/components/YIcons';
import { useTabConfig } from './use-tab-config';
import TopOptions from '@/pages/[locale]/markets/components/markets-view/components/top-option';
import { useResponsive } from '@/core/hooks';
const Tabs = (props: { tab?: string; setTab?: (tab: string) => void; onSearch: (tab: string) => void }) => {
  const { tab, setTab, onSearch } = props;
  const { HEADER_TABS_CONFIG } = useTabConfig();

  const { isMobile } = useResponsive(false);

  return (
    <div className="tabs-wrapper">
      {/* <ul className='tabs-wrapper-wrap'>
        <li className={clsx(tab === 'swapFavorIds' && 'active')} onClick={() => setTab('swapFavorIds')}>
          {LANG('自选')}
        </li>
        <li className={clsx(tab === 'swapUsdt' && 'active')} onClick={() => setTab('swapUsdt')}>
          {LANG('合约')}
        </li>
        <li
          className={clsx(tab === 'spot' && 'active')}
          onClick={() => setTab('spot')}
        >
          {LANG('现货')}
        </li>
      </ul> */}
      <TopOptions external={false} />
      <div className={clsx('search-box')}>
        {isMobile ? (
          // <YIcon.h5HomePagesearchIcon />
          <div className="search-box-wrap">
            <Input
              placeholder=""
              prefix={<YIcon.homePagesearchIcon />}
              onChange={({ target: { value } }) => {
                onSearch?.(value);
              }}
            />
          </div>
        ) : (
          <Input
            placeholder=""
            prefix={<YIcon.homePagesearchIcon />}
            onChange={({ target: { value } }) => {
              onSearch?.(value);
            }}
          />
        )}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

export default memo(Tabs);
const styles = css`
  .tabs-wrapper {
    display: flex;
    align-items: center;
    gap: 40px;
    @media ${MediaInfo.mobile} {
      justify-content: space-between;
      gap: 20px;
    }
    :global(.option1-wrapper) {
      @media ${MediaInfo.mobile} {
        height: auto;
      }
      :global(.option-left) {
        @media ${MediaInfo.mobile} {
          margin-top: 0;
        }
      }
    }
    &-wrap {
      display: flex;
      align-items: center;
      gap: 40px;
      flex: 1 0 0;
      width: 100%;
      padding: 0;
      li {
        font-size: 20px;
        font-weight: 500;
        color: var(--theme-font-color-3);
        cursor: pointer;
        white-space: nowrap;
        &.active {
          color: var(--brand);
        }
      }
    }
  }
  .search-box {
    :global(.ant-input-outlined) {
      background: transparent;
      border-radius: 40px;
      border: 1px solid var(--brand);
      display: flex;
      width: 200px;
      height: 40px;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
      @media ${MediaInfo.mobile} {
        width: 100px;
      }
    }
    :global(.ant-input-affix-wrapper) {
    }
    :global(input) {
      color: var(--text-primary);
      font-size: 14px;
      font-weight: 400;
    }
    :global(svg) {
      fill: #000000;
    }
  }
`;
