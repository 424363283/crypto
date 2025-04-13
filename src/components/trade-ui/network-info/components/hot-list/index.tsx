import { Group } from '@/core/shared';
import { isLite, isSpot, isSpotTradePage, isSwap, isSwapTradePage } from '@/core/utils';
import { debounce } from 'lodash';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import MarketItem from '../market-item';

export const HotList = ({
  setWidth,
  loaded,
  marketsDetail: _marketsDetail,
}: {
  setWidth?: (v: number) => any;
  marketsDetail?: any;
  loaded?: boolean;
}) => {
  // const [marketsDetail, setMarketDetail] = useState<MarketsMap>();
  const [hotIds, setHotIds] = useState<string[]>([]);
  const _isSwapTradePage = isSwapTradePage();
  const _isSpotTradePage = isSpotTradePage();

  // // 行情数据
  // useWs(SUBSCRIBE_TYPES.ws3001, async (detail) => {
  //   setMarketDetail(detail);
  // });
  useEffect(() => {
    (async () => {
      const group = await Group.getInstance();
      const hot_ids = group.getHotIds().map(v=> isLite(v) ? (group.getLiteQuoteCode(v) || v) : v);
      setHotIds(hot_ids);
    })();
  }, []);

  const hotList = hotIds.filter((v) => (_isSwapTradePage ? isSwap(v) : _isSpotTradePage ? isSpot(v) : isLite(v)));
  const hotListRef = useRef<any>(null);

  useLayoutEffect(() => {
    if (loaded) setWidth?.(hotListRef?.current?.offsetWidth || 0);
  }, [hotIds, loaded]);
  useEffect(() => {
    const handleResize = (): void => {
      setWidth?.(hotListRef?.current?.offsetWidth || 0);
    };
    handleResize();
    window.addEventListener('resize', debounce(handleResize, 300));
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div className='hot-list' ref={hotListRef}>
        {hotList?.map((id: any, index: number) => {
          return (
            <MarketItem
              // marketsDetail={marketsDetail || Markets.markets}
              key={index}
              last={index == hotList.length - 1}
              id={id}
            />
          );
        })}
      </div>
      <style jsx>{`
        .hot-list {
          height: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          font-size: 12px;
        }
      `}</style>
    </>
  );
};
export default HotList;
