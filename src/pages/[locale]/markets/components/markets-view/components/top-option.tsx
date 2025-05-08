// 表格筛选组件
import CommonIcon from '@/components/common-icon';
import { ExternalLink } from '@/components/link';
import { Desktop, DesktopOrTablet, Mobile } from '@/components/responsive';
import { ScrollXWrap } from '@/components/scroll-x-wrap';
import { useResponsive, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { MediaInfo, clsx } from '@/core/utils';
import { Input } from 'antd';
import Image from 'next/image';
import { memo, useCallback, useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { CURRENT_VIEW, store } from '../../../store';
import { useTabConfig } from './use-tab-config';
import ArrowBox from '@/components/ArrowBox';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { steps } from '@/components/header/components/header-swap-demo-guide';
const TopOptions = memo(({ external = true }: { external?: boolean }) => {
  const [value, setValue] = useState('');
  const { HEADER_TABS_CONFIG } = useTabConfig();
  const { isDark } = useTheme();
  const { currentId } = store;
  const { isMobile } = useResponsive(false);

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
      }
    };
    if (DEFAULT_ITEM_NAME.hasOwnProperty(currentId)) {
      DEFAULT_ITEM_NAME[currentId]();
    }
  }, [currentId]);
  const NextIcon = () => {
    return (
      <div className={clsx('top-option-arrow-right', isDark && 'dark-arrow')}>
        <Image src="/static/images/markets/bigger-icon.svg" width={12} height={12} alt="YMEX icon" />
      </div>
    );
  };
  const LeftOptions = ({ className }: { className?: string }) => {
    return (
      <>
        {HEADER_TABS_CONFIG.map(item => {
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
    <div className="option1-wrapper">
      {/* <Mobile> */}
      {/* <ScrollXWrap nextIcon={<NextIcon />} prevIcon={<></>} key="top-option"> */}
      {isMobile ? (
        // <ArrowBox leftArrowIcon={<LeftOutlined />} rightArrowIcon={<RightOutlined />} step={300}>
        <div className="option-left" id="optionLeft">
          <LeftOptions />
        </div>
      ) : (
        ''
      )}
      {/* </ScrollXWrap> */}
      {/* </Mobile> */}
      <div className="option-left">
        <DesktopOrTablet>
          <LeftOptions />
        </DesktopOrTablet>
      </div>
      {external && (
        <div className="option-right">
          <Desktop>
            <ExternalLink href="https://coinmarketcap.com/exchanges">
              <CommonIcon name="external-cmc-filled-0" className="icon" size={32} />
            </ExternalLink>
            <ExternalLink href="https://www.coingecko.com/en/exchanges">
              <CommonIcon name="external-coingecko-filled-0" className="icon" size={32} />
            </ExternalLink>
            <Input
            value={value}
            className="search-input"
            placeholder={LANG('搜索')}
            prefix={<CommonIcon size={20} className="prefix-icon" name="common-search-0" />}
            onChange={handleSearchChange}
          />
          </Desktop>
        
        </div>
      )}
      <style jsx>{styles}</style>
    </div>
  );
});
export default TopOptions;
const styles = css`
  .option1-wrapper {
    display: flex;
    width: 1200px;
    padding: 8px 0px;
    align-items: center;
    gap: 40px;
    max-width: var(--const-max-page-width);
    margin: 0 auto;
    @media ${MediaInfo.mobile} {
      height: 72px;
      margin: 0;
      max-width: 400px;
      overflow-x: scroll;
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
      gap: 40px;
      flex: 1 0 0;
      color: var(--text_3);
      @media ${MediaInfo.mobileOrTablet} {
        margin-top: 20px;
        gap: 20px;
        &::-webkit-scrollbar {
          display: none;
        }
      }
      :global(.main-menu) {
        @media ${MediaInfo.mobile} {
          font-size: 16px;
          white-space: nowrap;
        }
        color: var(--text_3);
        font-size: 20px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        cursor: pointer;
      }
      :global(.active) {
        font-weight: 500;
        position: relative;
        color: var(--text_brand);
      }
    }
    .option-right {
      display: flex;
      align-items: center;
      gap: 16px;
      @media ${MediaInfo.mobileOrTablet} {
        width: 100%;
      }
      position: relative;
      display: flex;
      align-items: center;
      :global(.search-input.ant-input-affix-wrapper-focused) {
        box-shadow: 0 0 0 1px var(--brand);
      }
      :global(a) {
        display: flex;
        align-items: center;
      }
      :global(.search-input) {
        height: 40px;
        width: 200px;
        background-color: var(--fill_3);
        transition: none;
        padding: 0 24px;
        border: none;
        border-radius: 40px;
        :global(.ant-input-prefix) {
          margin-inline-end: 8px;
        }
        :global(.ant-input) {
          color: var(--text_1);
          background-color: var(--fill_3);
          border: none;
          transition: none;
        }
        :global(input::placeholder) {
          color: var(--text_3);
        }
        &:hover {
          box-shadow: 0 0 0 1px var(--brand);
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
