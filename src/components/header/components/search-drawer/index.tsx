import React, { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { Drawer, Input } from 'antd';
import { LANG } from '@/core/i18n';
import CommonIcon from '@/components/common-icon';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { CURRENT_TAB } from '@/pages/[locale]/markets/store';
import { Markets, Group } from '@/core/shared';
import CoinLogo from '@/components/coin-logo';
import { clsx } from '@/core/utils/src/clsx';
import { useRouter } from '@/core/hooks/src/use-router';
import { useTradeHrefData } from '@/core/i18n/src/components/trade-link';
import { EmptyComponent } from '@/components/empty';
import { BasicInput, INPUT_TYPE } from '@/components/basic-input';
import { Layer, Size } from '@/components/constants';
import SearchInput from '@/components/basic-input/search-input';
import { getUUID, isLite } from '@/core/utils';
import { useResponsive } from '@/core/hooks';

interface MarketItem {
  id: string;
  name: string;
  fullName: string;
  icon: string;
  price: string;
  rate: string;
  coin: string;
  quoteCoin: string;
  type: string;
  isUp: boolean;
}

export const SearchBox = ({ searchKey, onClose }: { searchKey: string; onClose?: () => void }) => {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const { getHrefAndQuery } = useTradeHrefData();
  const [list, setList] = useState<Record<string, MarketItem[]>>({});
  const [hotList, setHotList] = useState<Record<string, MarketItem[]>>({});
  const markets = useRef<Markets>();
  if (typeof document === 'undefined') {
    React.useLayoutEffect = React.useEffect;
  }
  const resultList = useMemo(() => {
    if (!searchKey) {
      return hotList[CURRENT_TAB.PERPETUAL] || [];
    };

    const allMarkets = Object.values(list).flat();
    const lowerCaseSearchKey = searchKey.toLowerCase();
    return allMarkets.filter(
      item => {
        if (!isMobile || !isLite(item.id)) {
          return item.name.toLowerCase().includes(lowerCaseSearchKey) || item.fullName.toLowerCase().includes(lowerCaseSearchKey)
        }
        return false;
      }
    );
  }, [searchKey, list, hotList]);

  const handleItemClick = (id: string) => {
    const { href, query } = getHrefAndQuery(id.toUpperCase());
    router.push({ pathname: href, query });
    onClose?.();
  };

  useWs(SUBSCRIBE_TYPES.ws3001, async (detail: any) => {
    const group = await Group.getInstance();
    setHotList({
      [CURRENT_TAB.PERPETUAL]: Markets.getMarketList(detail, group.getHotSwapUsdtIds())
    });
    setList({
      [CURRENT_TAB.SPOT_GOODS]: Markets.getMarketList(detail, group.getSpotIds),
      [CURRENT_TAB.PERPETUAL]: Markets.getMarketList(detail, group.getSwapUsdtIds()),
      [CURRENT_TAB.LITE]: Markets.getMarketList(detail, group.getLiteQuoteIds),

    });
  });

  React.useLayoutEffect(() => {
    const key = `WS3001(${SearchBox.name}${getUUID(16)})`;
    Markets.getInstance({ lite: true, swap: true, spot: true, key: key }).then((v) => (markets.current = v));
    return () => {
      markets.current && markets.current.unsubscribeWS();
    };
  }, []);

  return (
    <div className='search-box'>
      <div className="search-content">
        {(resultList.length > 0 && !searchKey) && (
          <div className="search-hot-container">
            <Image src="/static/images/common/hot.svg" width="24" height="24" alt="hot" className="hot" />
            <span>{LANG('热门搜索')}</span>
          </div>
        )}
        <div className="search-results">
          {resultList.length > 0 ? (
            resultList.map((item, index) => (
              <div key={`${item.name}-${index}`} className="result-item" onClick={() => handleItemClick(item.id)}>
                <div className="left">
                  <CoinLogo width="24" height="24" className="icon-logo" coin={item.coin} />
                  <div className="info">
                    {item.type?.toUpperCase() === 'SPOT' || item.type?.toUpperCase() === 'ETF' ? (
                      <span className="symbol coin_symbol"> {item.coin}/{item.quoteCoin} </span>
                    ) : (
                      <span className="symbol coin_alias">{item.name}</span>
                    )}
                  </div>
                </div>
                <div className="right">
                  <div className="price-wrap">
                    <span className="price">{item.price}</span>
                    <div className={clsx('rate', item.isUp ? 'positive-text' : 'negative-text')}>{item.rate}%</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty">
              <EmptyComponent text={LANG('暂无数据')} layer={Layer.Overlay} />
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .search-box {
          height: 100%;
          padding: 16px 0;
          overflow: hidden;
        }
        .search-content {
          display: flex ;
          flex-direction: column;
          gap: 16px;
          overflow: auto;
          height: 100%;
          :global(.ant-input-affix-wrapper) {
            border-radius: 40px;
            height: 44px;
            background: var(--fill_2);
            border: none;
          }
          :global(.ant-input) {
            background: var(--fill_2);
            color: var(--text_1);
          }
          :global(.ant-input::placeholder) {
            color: var(--text_2);
          }
        }
        .search-hot-container {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 4px;
          height: 2.5rem;
          font-size: 14px;
          color: var(--text_2);
          line-height: normal;
          padding: 0 24px;
          :global(img) {
            margin-left: 0 !important;
            margin-top: 0 !important;
          }
        }
        .search-results {
          display: flex;
          flex-direction: column;
          gap: 16px;
          .result-item {
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 44px;
            padding: 0 24px;
            &:hover {
              background: var(--fill_2);
            }
            .left {
              display: flex;
              align-items: center;
              gap: 8px;
              .info {
                display: flex;
                flex-direction: column;
                gap: 2px;
                .symbol {
                  font-size: 14px;
                  font-weight: 500;
                  color: var(--text_1);
                }
                .type {
                  font-size: 12px;
                  color: var(--text_2);
                }
              }
            }
            .right .price-wrap {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              gap: 8px;
              .price {
                font-size: 14px;
                color: var(--text_1);
                font-weight: 500;
              }
              .rate {
                font-size: 12px;
              }
            }
          }
        }
        .empty {
          height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>

  )

}

interface SearchDrawerProps {
  open: boolean;
  onClose: () => void;
  onSearch: (value: string) => void;
}

export const SearchDrawer = ({ open, onClose, onSearch }: SearchDrawerProps) => {
  // const router = useRouter();
  // const { getHrefAndQuery } = useTradeHrefData();
  // const [list, setList] = useState<Record<string, MarketItem[]>>({});
  const [searchKey, setSearchKey] = useState('');

  // useWs(SUBSCRIBE_TYPES.ws3001, async (detail: any) => {
  //   const group = await Group.getInstance();
  //   setList({
  //     //   [CURRENT_TAB.SPOT_GOODS]: Markets.getMarketList(detail, group.getHotSpotCoinIds()),
  //     [CURRENT_TAB.PERPETUAL]: Markets.getMarketList(detail, group.getHotSwapUsdtIds())
  //   });
  // });

  // const resultList = useMemo(() => {
  //   const allMarkets = Object.values(list).flat();
  //   if (!searchKey) return allMarkets;
  //
  //   const lowerCaseSearchKey = searchKey.toLowerCase();
  //   return allMarkets.filter(
  //     item =>
  //       item.name.toLowerCase().includes(lowerCaseSearchKey) || item.fullName.toLowerCase().includes(lowerCaseSearchKey)
  //   );
  // }, [searchKey, list]);

  const handleSearch = (value: string) => {
    setSearchKey(value);
    onSearch?.(value);
  };

  // const handleItemClick = (id: string) => {
  //   const { href, query } = getHrefAndQuery(id.toUpperCase());
  //   router.push({ pathname: href, query });
  //   onClose();
  // };

  return (
    <Drawer placement="bottom" onClose={onClose} open={open} height="100%" className="search-drawer">
        <div className="search-input-wrapper">
          <SearchInput
            prefix
            width='100%'
            size={Size.DEFAULT}
            placeholder={LANG('搜索')}
            onChange={(val: string) => {
              handleSearch(val);
            }}
          />
        </div>
        {/* <Input
          autoFocus
          placeholder={LANG('搜索')}
          prefix={<CommonIcon name="common-search" size={20} className="search-icon" />}
          onChange={({ target: { value } }) => handleSearch(value)}
        /> */}

        <SearchBox searchKey={searchKey} onClose = {onClose} />
         {/*
         resultList.length > 0 && (
          <div className="search-hot-container">
            <Image src="/static/images/common/hot.svg" width="24" height="24" alt="hot" className="hot" />
            <span>{LANG('热门搜索')}</span>
          </div>
        )
        */}
        {/*
        <div className="search-results">
          {resultList.length > 0 ? (
            resultList.map((item, index) => (
              <div key={`${item.name}-${index}`} className="result-item" onClick={() => handleItemClick(item.id)}>
                <div className="left">
                  <CoinLogo width="32" height="32" className="icon" coin={item.coin} />
                  <div className="info">
                    <span className="symbol">
                      {item.coin}/{item.quoteCoin}
                    </span>
                  </div>
                </div>
                <div className="right">
                  <div className="price-wrap">
                    <span className="price">{item.price}</span>
                    <div className={clsx('rate', item.isUp ? 'positive-text' : 'negative-text')}>{item.rate}%</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty">
              <EmptyComponent text={LANG('暂无数据')} layer={Layer.Overlay} />
            </div>
          )}
        </div> 
        */}
      <style jsx>{`
        :global(.search-drawer) {
          background: var(--fill_1) !important;
          overflow: hidden;
          :global(.ant-drawer-header) {
            padding: 0 !important;
            text-align: right;
            border-bottom: 1px solid var(--fill_line_1) !important;
          }
          :global(.ant-drawer-header-title) {
            height: 44px;
            position: relative;
          }
          :global(.ant-drawer-close) {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 20px;
            :global(svg) {
              color: var(--text_2);
              cursor: pointer;
            }
          }
          :global(.ant-drawer-body) {
            padding: 0 !important;
          }
          :global(.search-icon) {
            color: var(--text_2);
          }
        }
        .search-input-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 24px;
          position: sticky;
          top: 0;
          :global(.search-input) {
            :global(.basic-input-box) {
              background: var(--fill_3);
              &:hover {
                background: var(--fill_1);
              }
            }
          }
        }
        :global(.search-box) {
          :global(.search-drawer) & {
            height: calc(100% - 76px);
          }
        }
      `}</style>
    </Drawer>
  );
};
