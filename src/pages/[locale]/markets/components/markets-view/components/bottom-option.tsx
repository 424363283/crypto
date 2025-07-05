import { ScrollXWrap } from '@/components/scroll-x-wrap';
import { MediaInfo, clsx } from '@/core/utils';
import Image from 'next/image';
import { memo, useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { store } from '../../../store';
import { CURRENT_TAB, CURRENT_VIEW, PERPETUAL_OPTION_ID } from '../../../types';
import { useCascadeOptions } from '../../hooks';
import { Options } from '../../hooks/types';
import { LANG } from '@/core/i18n';

const BottomOption = () => {
  const { currentId, thirdItem, secondItem } = store;
  const config = useCascadeOptions() as { thirdOptions: Options[] };
  // const [thirdConfigOption, setThirdConfigOption] = useIndexedDB(
  //   IDB_STORE_KEYS.MARKET_THIRD_CONFIG_OPTION,
  //   config.thirdOptions
  // );
  const [thirdConfigOption, setThirdConfigOption] = useState(config.thirdOptions);
  const handleClick = (item: Options) => {
    store.thirdItem = {
      id: item.id,
      name: item.name
    };
    store.currentView = CURRENT_VIEW.TABLE;
  };
  useEffect(() => {
    store.thirdItem = {
      ...store.thirdItem,
      id: thirdItem.id
    };
  }, [thirdItem.id]);
  useEffect(() => {
    store.thirdItem = {
      name: 'All',
      id: '2-1-1'
    };
  }, [secondItem.id]);

  useEffect(() => {
    setThirdConfigOption(config.thirdOptions);
  }, [config.thirdOptions]);

  const renderThirdOptions = () => {
    return thirdConfigOption?.map((item: Options) => {
      return (
        <div
          key={item.id}
          className={clsx(item.id === thirdItem.id ? 'active' : '', item.name === 'LVTs' ? 'etf' : '', 'third-item')}
          onClick={() => handleClick(item)}
        >
          {/^[a-zA-Z0-9]+$/.test(item.name) ? item.name : LANG(item.name)}
          {item.name === 'LVTs' && <Image src="/static/images/common/3x.svg" alt="" width="16" height="14" />}
        </div>
      );
    });
  };
  const PrevIcon = () => {
    return (
      <div className="mobile-arrow-left">
        <Image src="/static/images/header/media/arrow-left.svg" width={24} height={24} alt="icon" />
      </div>
    );
  };
  const NextIcon = () => {
    return (
      <div className="mobile-arrow-right">
        <Image src="/static/images/header/media/arrow-right.svg" width={24} height={24} alt="icon" />
      </div>
    );
  };
  const render = () => {
    if (
      (CURRENT_TAB.SPOT_GOODS === currentId ||
        (CURRENT_TAB.PERPETUAL === currentId && secondItem.id === PERPETUAL_OPTION_ID.SWAP_USDT)) &&
      thirdConfigOption
    ) {
      return (
        <div className="option3-wrapper">
          <ScrollXWrap prevIcon={<PrevIcon />} wrapClassName="mobile-list" nextIcon={<NextIcon />}>
            {renderThirdOptions()}
          </ScrollXWrap>
          <style jsx>{styles}</style>
        </div>
      );
    }
    return (
      <div className="option3-wrapper">
        <style jsx>{styles}</style>
      </div>
    );
  };
  return render();
};
export default memo(BottomOption);

const styles = css`
  .option3-wrapper {
    display: flex;
    height: 32px;
    overflow: hidden;
    align-items: center;
    flex: 1 auto;
    @media ${MediaInfo.desktop} {
      flex-wrap: wrap;
    }
    align-items: center;
    @media ${MediaInfo.mobileOrTablet} {
      overflow-x: auto;
      width: 100%;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    @media ${MediaInfo.tablet} {
      margin-bottom: 20px;
    }
    @media ${MediaInfo.mobile} {
      width: auto;
      height: 100%;
      margin-bottom: 0;
    }

    :global(.third-item) {
      height: 32px;
      font-size: 12px;
      font-weight: 400;
      color: var(--text_2);
      padding: 8px 16px;
      position: relative;
      cursor: pointer;
      flex-shrink: 0;
      border-radius: 6px;
      border: 1px solid var(--fill_line_3);
      @media ${MediaInfo.mobile} {
        display: flex;
        align-items: center;
        height: auto;
        border-radius: 4px;
        padding: 4px 1rem;
      }
    }
    :global(.third-item.active),
    :global(.third-item:hover) {
      color: var(--text_1);
      background-color: var(--fill_3);
      border: 1px solid transparent;
    }
    :global(.etf) {
      display: flex;
      align-items: center;
      :global(img) {
        border-top-right-radius: 6px;
        width: 22px;
        margin-left: 4px;
      }
    }

    :global(.mobile-list) {
      display: flex;
      align-items: center;
      margin: 0;
      width: 100%;
      gap: 16px;
      @media ${MediaInfo.mobile} {
        gap: 8px;
      }
    }
    :global(.mobile-arrow-left) {
      position: absolute;
      left: -20px;
      padding: 4px 6px 2px 0;
      z-index: 9;
      background-color: var(--fill_bg_1);
      height: 100%;
    }
    :global(.scroll-wrap) {
      :global(.prev) {
        opacity: 1 !important;
      }
      :global(.next) {
        opacity: 1 !important;
      }
    }
    :global(.mobile-arrow-right) {
      position: absolute;
      right: -20px;
      padding: 4px 0 2px 6px;
      background-color: var(--fill_bg_1);
      height: 100%;
    }
  }
`;
