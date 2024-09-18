// 表格筛选组件
import CommonIcon from '@/components/common-icon';
import { ExternalLink } from '@/components/link';
import { Desktop, DesktopOrTablet, Mobile } from '@/components/responsive';
import { ScrollXWrap } from '@/components/scroll-x-wrap';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { MediaInfo, clsx } from '@/core/utils';
import { Input } from 'antd';
import Image from 'next/image';
import { memo, useCallback, useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { CURRENT_VIEW, store } from '../../../store';
import { useTabConfig } from './use-tab-config';

const TopOptions = memo(() => {
  const [value, setValue] = useState('');
  const { HEADER_TABS_CONFIG } = useTabConfig();
  const { isDark } = useTheme();
  const { currentId } = store;

  const onTabChange = (item: any) => {
    store.currentId = item.id;
    store.currentView = CURRENT_VIEW.TABLE;
  };
  const handleSearchChange = useCallback((e: any) => {
    const upperCaseValue = e.target.value.toUpperCase();
    setValue(upperCaseValue);
    store.searchValue = upperCaseValue;
  }, []);

  useEffect(() => {
    const DEFAULT_ITEM_NAME = {
      [HEADER_TABS_CONFIG[1].id]: () => {
        store.secondItem.name = 'USDT';
      },
    };
    if (DEFAULT_ITEM_NAME.hasOwnProperty(currentId)) {
      DEFAULT_ITEM_NAME[currentId]();
    }
  }, [currentId]);
  const NextIcon = () => {
    return (
      <div className={clsx('top-option-arrow-right', isDark && 'dark-arrow')}>
        <Image src='/static/images/markets/bigger-icon.svg' width={12} height={12} alt='y-mex icon' />
      </div>
    );
  };
  const LeftOptions = ({ className }: { className?: string }) => {
    return (
      <>
        {HEADER_TABS_CONFIG.map((item) => {
          return (
            <div
              key={item.id}
              className={item.id === currentId ? clsx('active main-menu', className) : clsx('main-menu', className)}
              onClick={() => onTabChange(item)}
            >
              <span>{item.name}</span>
            </div>
          );
        })}
      </>
    );
  };
  return (
    <div className='option1-wrapper'>
      <Mobile>
        <ScrollXWrap nextIcon={<NextIcon />} prevIcon={<></>} key='top-option'>
          <div className='option-left'>
            <LeftOptions />
          </div>
        </ScrollXWrap>
      </Mobile>
      <div className='option-left'>
        <DesktopOrTablet>
          <LeftOptions />
        </DesktopOrTablet>
      </div>
      <div className='option-right'>
        <Desktop>
          <ExternalLink href='https://coinmarketcap.com/exchanges/y-mex/'>
            <CommonIcon name='external-cmc-filled-0' className='icon' size={26} />
          </ExternalLink>
          <ExternalLink href='https://www.coingecko.com/en/exchanges/y-mex'>
            <CommonIcon name='external-coingecko-filled-0' className='icon' size={26} />
          </ExternalLink>
        </Desktop>
        <Input
          value={value}
          className='search-input'
          placeholder={LANG('搜索币种')}
          prefix={<CommonIcon size={16} className='prefix-icon' name='common-search-0' />}
          onChange={handleSearchChange}
        />
      </div>
      <style jsx>{styles}</style>
    </div>
  );
});
export default TopOptions;
const styles = css`
  .option1-wrapper {
    height: 70px;
    display: flex;
    position: relative;
    width: 100%;
    justify-content: space-between;
    max-width: var(--const-max-page-width);
    margin: 0 auto;
    @media ${MediaInfo.mobile} {
      height: 72px;
    }
    :global(.scroll-wrap) {
      :global(.prev) {
        opacity: 1 !important;
      }
      :global(.next) {
        opacity: 1 !important;
      }
    }
    :global(.top-option-arrow-right) {
      position: absolute;
      top: 33px;
      right: -24px;
      background-color: var(--theme-secondary-bg-color);
      padding: 4px 6px 2px;
    }
    :global(.dark-arrow) {
      background-color: rgba(41, 44, 44, 1);
    }
    :global(.option-left) {
      display: flex;
      align-items: center;
      @media ${MediaInfo.mobileOrTablet} {
        margin-top: 20px;
        &::-webkit-scrollbar {
          display: none;
        }
      }
      :global(.main-menu) {
        @media ${MediaInfo.desktop} {
          height: 70px;
        }
        @media ${MediaInfo.mobile} {
          font-size: 16px;
        }
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 20px;
        font-weight: 400;
        flex-shrink: 0;
        color: var(--theme-font-color-3);
        margin-right: 45px;
      }
      :global(.active) {
        font-weight: 500;
        position: relative;
        color: var(--theme-font-color-1);
        border-bottom: 2px solid var(--skin-color-active);
      }
    }
    .option-right {
      @media ${MediaInfo.desktop} {
        width: 260px;
      }
      @media ${MediaInfo.mobileOrTablet} {
        width: 100%;
      }
      position: relative;
      display: flex;
      align-items: center;
      :global(.search-input.ant-input-affix-wrapper-focused) {
        border: 1px solid var(--skin-primary-color);
      }
      :global(a) {
        display: flex;
        align-items: center;
      }
      :global(.icon) {
        margin-right: 15px;
      }
      :global(.search-input) {
        height: 36px;
        width: 290px;
        background-color: var(--theme-secondary-bg-color);
        border: 1px solid var(--skin-border-color-1);
        transition: none;
        :global(.ant-input) {
          color: var(--theme-font-color-1);
          background-color: var(--theme-secondary-bg-color);
          border: none;
          transition: none;
        }
        :global(input::placeholder) {
          color: var(--theme-font-color-2);
        }
        &:hover {
          border: 1px solid var(--skin-primary-color);
        }
      }
      @media ${MediaInfo.mobileOrTablet} {
        position: absolute;
        top: -30px;
        :global(.search-input) {
          width: 100%;
          padding: 9px 10px;
        }
      }
    }
  }
`;
