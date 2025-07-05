import { MobileDrawer } from '@/components/drawer';
import CommonIcon from '@/components/common-icon';
import CoinLogo from '@/components/coin-logo';
import { RateText } from '@/components/rate-text';
import { EmptyComponent } from '@/components/empty';
import { useMiniChartData, useLocalStorage } from '@/core/hooks';
import { TradeLink } from '@/core/i18n';
import { MarketItem } from '@/core/shared';
import { isSwap, clsx } from '@/core/utils';
import { useEffect, useState, useMemo, useCallback } from 'react';
import css from 'styled-jsx/css';
import { useQuoteSearchStore } from '@/store/quote-search';
import { BasicInput, INPUT_TYPE } from '@/components/basic-input';
import { Layer, Size } from '@/components/constants';
import { LANG } from '@/core/i18n';
import Image from 'next/image';
import { store } from '@/pages/[locale]/markets/store';
import { LOCAL_KEY } from '@/core/store';

interface SearchDrawerProps {
  onClose: () => void;
  open: boolean;
}

const SearchDrawer = (props: SearchDrawerProps) => {
  const { onClose, open } = props;
  const searchTerm = useQuoteSearchStore(state => state.searchTerm);
  const setSearchTerm = useQuoteSearchStore(state => state.setSearchTerm);

  const [hotList, setHotList] = useState<MarketItem[]>([]);
  const [coinList, setCoinList] = useState<string[]>(['BTC-USDT', 'ETH-USDT']);
  const { setSymbols, isLoading } = useMiniChartData();
  const { marketDetailList } = store;
  const [localHotList, setLocalHotList] = useLocalStorage(LOCAL_KEY.MARKET_MINI_CHART_DATA, hotList);
  const getCardListData = useCallback((detailList: any) => {
    const data = coinList.map((item: string) => detailList[item]).filter(Boolean);
    const filteredList = Object.values(detailList).filter(
      // (item: any) => item.type !== 'SPOT' && item.quoteCoin === 'USDT' && item.rate !== '--' && !coinList.includes(item.quoteCode)
      (item: any) => {
        // if (isFilterSpot) {
        //   return item.type === 'SPOT' && item.quoteCoin === 'USDT' && item.rate !== '--' && !coinList.includes(item.quoteCode)
        // } else {
        //   return item.type !== 'SPOT' && item.quoteCoin === 'USDT' && item.rate !== '--' && !coinList.includes(item.quoteCode)
        // }
        return isSwap(item.id) && item.rate !== '--' && !coinList.includes(item.quoteCode);
      }
    );
    if (!filteredList.length || isLoading) return;
    filteredList.sort((a: any, b: any) => {
      if (a.rate === '--' && b.rate === '--') {
        return 0;
      } else if (a.rate === '--') {
        return 1;
      } else if (b.rate === '--') {
        return -1;
      } else {
        const rateA = parseFloat(a.rate);
        const rateB = parseFloat(b.rate);
        return rateB - rateA;
      }
    });

    const firstTwoMaxRateValue = filteredList.slice(0, 2);

    const firstTwoSymbols = firstTwoMaxRateValue.map((item: any) => item.id);
    setCoinList([...coinList, ...firstTwoSymbols.slice(0, 2)]);

    const newData = data.concat(firstTwoMaxRateValue);
    setHotList(newData);
    setLocalHotList(newData);
  }, []);

  useEffect(() => {
    getCardListData(marketDetailList);
  }, [marketDetailList]);
  useEffect(() => {
    if (coinList.length > 2) {
      setSymbols(coinList);
    }
  }, [JSON.stringify(coinList)]);
  const isEmpty = useMemo(
    () => (hotList.length > 0 ? !hotList.find(item => (searchTerm ? item.name.includes(searchTerm) : true)) : true),
    [hotList, searchTerm]
  );


  return (
    <MobileDrawer onClose={onClose} open={open} className="search-drawer" destroyOnClose>
      <div className="search-container">
        <div className="search-input-wrapper">
          <BasicInput
            label={''}
            type={INPUT_TYPE.NORMAL_TEXT}
            placeholder={LANG('搜索')}
            value={searchTerm}
            size={Size.SM}
            rounded
            clearable={true}
            prefix={<CommonIcon size={16} className="prefix-icon" name="common-search-0" />}
            onInputChange={(val: string) => {
              setSearchTerm(val.toUpperCase());
            }}
          />
        </div>
        {!isEmpty && (
          <div className="search-hot-container">
            <Image src="/static/images/common/hot.svg" width="24" height="24" alt="hot" className="hot" />
            <span>{LANG('热门搜索')}</span>
          </div>
        )}
        <div className="hot-list-wrapper">
          {!isEmpty ? (
            hotList
              .filter(item => (searchTerm ? item.name.includes(searchTerm) : true))
              .map(item => (
                <TradeLink key={item.id} className={clsx('hot-item')} id={item.id} native>
                  <div className="left">
                    <CoinLogo coin={item.coin} alt="YMEX" width="24" height="24" />
                    <span>
                      {`${item.coin}${item.type === 'SPOT' ? '/' : ''}${item.quoteCoin} ` ||
                        `--${item.type === 'SPOT' ? '/' : ''}--`}
                    </span>
                  </div>
                  <div className="right">
                    {' '}
                    <span>
                      <RateText money={item.price} prefix useFormat scale={item?.digit || 4} />
                    </span>
                    <span style={{ color: item?.isUp ? 'var(--color-green)' : 'var(--color-red)' }}>
                      {item?.rate || '- -'}%
                    </span>
                  </div>
                </TradeLink>
              ))
          ) : (
            <div className="empty-wrapper">
              <EmptyComponent text={LANG('暂无数据')} active layer={Layer.Overlay} />
            </div>
          )}
        </div>
      </div>
      <style jsx>{styles}</style>
    </MobileDrawer>
  );
};

const styles = css`
  :global(.search-drawer) {
    :global(.ant-drawer-header) {
      border-bottom: 1px solid var(--fill_line_1) !important;
    }
  }
  .search-container {
    padding: 1rem 0.5rem;
    height: 100%;
  }
  .search-input-wrapper,
  .search-hot-container,
  .hot-list-wrapper,
  :global(.hot-item),
  .left,
  .right {
    display: flex;
    align-items: center;
  }
  .search-input-wrapper {
    justify-content: center;
    :global(.basic-input-box) {
      background: var(--fill_3);
      &:hover {
        background: var(--fill_1);
      }
    }
  }
  .search-hot-container {
    justify-content: flex-start;
    gap: 4px;
    margin-top: 1rem;
    height: 2.5rem;
    font-size: 14px;
    color: var(--text_2);
    line-height: normal;
  }
  .hot-list-wrapper {
    flex-direction: column;
    justify-content: flex-start;
    margin-top: 8px;
    gap: 1.5rem;
  }
  :global(.hot-item) {
    justify-content: space-between;
    width: 100%;
    color: var(--text_1);
    font-size: 14px;
    .left {
      gap: 8px;
      font-weight: 500;
    }
    .right {
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-end;
      span:last-child {
        font-size: 12px;
      }
    }
  }
`;

export default SearchDrawer;
