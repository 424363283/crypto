import { ScrollXWrap } from '@/components/scroll-x-wrap';
import { TradeLink } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { Group, MarketItem, Markets } from '@/core/shared';
import { MediaInfo, formatDefaultText, isLite, isLiteTradePage, isSpot, isSpotTradePage, isSwap, isSwapTradePage } from '@/core/utils';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';

export const HotQuote = () => {
  const [tradeHotList, setTradeHotList] = useState<MarketItem[]>([]);
  const _isSpotTradePage = isSpotTradePage();
  const _isSwapTradePage = isSwapTradePage();
  const _isLiteTradePage = isLiteTradePage();
  const getTradeHotList = async () => {
    const group = await Group.getInstance();
    const hot_ids = group.getHotIds();
    const hotList = hot_ids.reduce((list: string[], item: string) => {
      if (_isSpotTradePage) {
        if (isSpot(item)) {
          list.push(item);
        }
      } else if (_isSwapTradePage) {
        if (isSwap(item)) {
          list.push(item);
        }
      } else if (_isLiteTradePage) {
        if (isLite(item)) {
          list.push(group.getLiteQuoteCode(item));
        }
      }
      return list;

    }, []);
    return hotList;
  };

  useWs(SUBSCRIBE_TYPES.ws3001, async (data) => {
    const list = await getTradeHotList();
    const _data = Markets.getMarketList(data, list);
    setTradeHotList(_data);
  });

  useEffect(() => {
    const myEvent = new Event('resize');
    window.dispatchEvent(myEvent);
  }, [tradeHotList]);

  return (
    <>
      <div className='container isDesktopPro'>
        <ScrollXWrap wrapClassName='hot-quote-container'>
          <ul>
            {tradeHotList.map((item) => (
              <li key={item.id}>
                <TradeLink id={item.id}>
                  {isLite(item?.id) ? <span>{item?.name}</span> : <span>{`${item?.coin}${item?.type === 'SPOT' ? '/' : ''}${item?.quoteCoin} `}</span>}
                  <span className='rate' style={{ color: `var(${item.isUp ? '--color-green' : '--color-red'})` }}>
                    {formatDefaultText(item.rate)}%
                  </span>
                </TradeLink>
              </li>
            ))}
          </ul>
        </ScrollXWrap>
      </div>

      <style jsx>{styles}</style>
    </>
  );
};

const styles = css`
  .container {
    overflow: hidden;
    display: flex;
    align-items: center;
    :global(.prev) {
      left: 13px !important;
    }
    :global(.next) {
      right: 13px !important;
    }
    :global(.hot-quote-container) {
      display: flex;
      align-items: center;
      margin: 0 13px;
      @media ${MediaInfo.mobile} {
        margin: 0 15px;
      }
      ul {
        display: flex;
        align-items: center;
        margin: 0;
        padding: 0;
        height: 28px;
        li {
          margin-right: 33px;
          :global(a) {
            color: var(--text_1);
            font-size: 12px;
            .rate {
              margin-left: 8px;
            }
          }
        }
      }
    }
  }
  .isDesktopPro {
    :global(.prev) {
      left: 24px !important;
    }
    :global(.next) {
      right: 24px !important;
    }
    :global(.hot-quote-container) {
      display: flex;
      align-items: center;
      margin: 0 24px;
    }
  }
`;
