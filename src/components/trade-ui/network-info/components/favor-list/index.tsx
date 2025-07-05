import { FavorEmitter } from '@/core/events';
import { FAVORITE_TYPE, FAVORS_LIST, Favors } from '@/core/shared';
import { isLite, isLiteTradePage, isSpotTradePage, isSwapDemo, isSwapTradePage } from '@/core/utils/src/is';
import debounce from 'lodash/debounce';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-use';
import MarketItem from '../market-item';
import { Group } from '@/core/shared';

export const FavorList = ({
  setWidth,
  loaded,
  marketsDetail: _marketsDetail,
}: {
  setWidth?: (v: number) => any;
  marketsDetail?: any;
  loaded?: boolean;
}) => {
  const _ = useRef({ width: 0 }).current;
  const [totalFavorsList, setFavorsList] = useState<FAVORS_LIST[]>([]);
  // const [marketsDetail, setMarketDetail] = useState<MarketsMap>();

  const isSwapTrade = isSwapTradePage();
  const isSpotTrade = isSpotTradePage();
  const isLiteTrade = isLiteTradePage();
  const fetchFavorsList = async () => {
    const group = await Group.getInstance();
    const favors = await Favors.getInstance();
    const favList = favors.getFavorsList().map(obj => {
      let item = {...obj};
      if (obj.type === FAVORITE_TYPE.LITE) {
        item.list = obj.list.map(id => group.getLiteQuoteCode(id) || id);
      }
      return item;
    });
    setFavorsList(favList || []);
  };
  // 行情数据
  // useWs(SUBSCRIBE_TYPES.ws3001, async (detail) => {
  //   setMarketDetail(detail);
  // });
  useEffect(() => {
    const callback = () => {
      fetchFavorsList();
    };
    callback();
    FavorEmitter.addListener(FavorEmitter.Update, callback);
    return () => {
      FavorEmitter.removeListener(FavorEmitter.Update, callback);
    };
  }, []);
  const isDemo = isSwapDemo(useLocation().pathname);
  const favorsList = totalFavorsList.reduce<any>((r, v) => {
    let typeList: string[] = [];
    if (isSwapTrade) {
      if (!isDemo) {
        typeList = [FAVORITE_TYPE.SWAP_USDT, FAVORITE_TYPE.SWAP_COIN];
      } else {
        typeList = [FAVORITE_TYPE.SWAP_USDT_TESTNET, FAVORITE_TYPE.SWAP_COIN_TESTNET];
      }
    } else if (isSpotTrade) {
      typeList = [FAVORITE_TYPE.SPOT];

    } else if (isLiteTrade) {
      typeList = [FAVORITE_TYPE.LITE];
    }
    r = [...r, ...(typeList.includes(v.type) ? v.list : [])];
    return r;

  }, []);
  const favorListRef = useRef<any>(null);
  useLayoutEffect(() => {
    if (favorListRef?.current?.offsetWidth > 0 && favorListRef?.current?.offsetWidth != _.width) {
      _.width = favorListRef?.current?.offsetWidth;
      setWidth?.(_.width);
    }
  }, [favorsList, loaded]);
  useEffect(() => {
    const handleResize = (): void => {
      if (favorListRef?.current?.offsetWidth > 0 && favorListRef?.current?.offsetWidth != _.width) {
        _.width = favorListRef?.current?.offsetWidth;
        setWidth?.(_.width);
      }
    };
    handleResize();
    window.addEventListener('resize', debounce(handleResize, 300));
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <>
      <div className='favorite-list' ref={favorListRef}>
        {favorsList?.map((id: any, index: number) => {
          return <MarketItem key={index} last={index == favorsList.length - 1} id={id} />;
        })}
      </div>
      <style jsx>{`
        .favorite-list {
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
export default FavorList;
