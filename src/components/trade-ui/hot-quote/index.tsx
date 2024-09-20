import { ScrollXWrap } from '@/components/scroll-x-wrap';
import { TradeLink } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { Group, MarketItem, Markets } from '@/core/shared';
import { MediaInfo, formatDefaultText, isSpot } from '@/core/utils';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';

export const HotQuote = () => {
  const [spotHotList, setSpotHotList] = useState<MarketItem[]>([]);

  const getSpotHotList = async () => {
    const group = await Group.getInstance();
    const hot_ids = group.getHotIds();
    const list: string[] = [];

    hot_ids.forEach((item) => {
      if (isSpot(item)) {
        list.push(item);
      }
    });
    return list;
  };

  useWs(SUBSCRIBE_TYPES.ws3001, async (data) => {
    const list = await getSpotHotList();
    const _data = Markets.getMarketList(data, list);
    setSpotHotList(_data);
  });

  useEffect(() => {
    const myEvent = new Event('resize');
    window.dispatchEvent(myEvent);
  }, [spotHotList]);

  return (
    <>
      <div className='container isDesktopPro'>
        <ScrollXWrap wrapClassName='hot-quote-container'>
          <ul>
            {spotHotList.map((item) => (
              <li key={item.id}>
                <TradeLink id={item.id}>
                  {item.id.replace('_', '/')}
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
            color: var(--theme-font-color-1);
            font-size: 12px;
            .rate {
              margin-left: 5px;
            }
          }
        }
      }
    }
  }
  .isDesktopPro {
    :global(.prev) {
      left: 18px !important;
    }
    :global(.next) {
      right: 18px !important;
    }
    :global(.hot-quote-container) {
      display: flex;
      align-items: center;
      margin: 0 47px;
    }
  }
`;
