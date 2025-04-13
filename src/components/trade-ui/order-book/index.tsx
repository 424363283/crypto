import { Svg } from '@/components/svg';
import { OrderBookEmitter } from '@/core/events';
import { useOnlineById, useResponsive, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { DetailMap, OrderBookItem, Swap, TradeMap } from '@/core/shared';
import { resso } from '@/core/store';
import { MediaInfo, clsx, isSpot, isSwapCoin, isSwapSLCoin, isSwapSLUsdt, isSwapUsdt } from '@/core/utils';
import { useEffect, useMemo, useState } from 'react';
import { VolUnitSelect } from './components/vol_unit_select';
import { DepthConfig } from './depth-config';
import { OrderBookRates } from './order-book-rates';
import { OrderList } from './order-list';
import { OrderPrice } from './order-price';
import { OrderWrap } from './order-wrap';
import { OrderTypes } from './types';

export enum ORDER_BOOK_TYPES {
  SPOT = 'SPOT',
  SWAP = 'SWAP'
}
export type ListDataType = { asks: OrderBookItem[]; bids: OrderBookItem[] };
const store = resso({ list: { asks: [], bids: [] } });
export const OrderBook = ({ type }: { type: ORDER_BOOK_TYPES }) => {
  const { isSmallDesktop, isMobile, isTablet, isDesktop } = useResponsive();
  const { id } = useRouter().query;
  const online = useOnlineById(id);
  const inSpot = isSpot(id);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [marketDetail, setMarketDetail] = useState<DetailMap>();
  const [depthConfig, setDepthConfig] = useState<number | null>(null);
  const [quoteCoin, setQuoteCoin] = useState('');

  useEffect(() => {
    if (isSpot(id)) {
      TradeMap.getSpotById(id).then(res => {
        res && setQuoteCoin(res?.quoteCoin || '');
      });
    }
  }, [id]);
  const { list } = store;
  const setList = (v: any) => (store.list = v);

  useWs(SUBSCRIBE_TYPES.ws4001, data => {
    Swap.Utils.setNewestPrice(data?.price);
    setMarketDetail(data);
  });
  useWs(SUBSCRIBE_TYPES.ws7001, data => {
    setList(data);
  });

  const isSpotOrderBook = type === ORDER_BOOK_TYPES.SPOT;
  const isSwapOrderBook = type === ORDER_BOOK_TYPES.SWAP;
  const spotCount = useMemo(() => {
    if (inSpot) {
      if (isMobile) {
        return 6;
      }
      if (isTablet) {
        return 7;
      }
      if (isSmallDesktop) {
        return 6;
      }
      if (isDesktop) {
        return 8;
      }
      return 6;
    } else {
      if (isTablet || isMobile) {
        return 6;
      }
      if (isSmallDesktop || isDesktop) {
        return 8;
      }
    }
    return 7;
  }, [isTablet, isSmallDesktop, inSpot]);
  const swapCount = isMobile ? 5 : isTablet ? 7 : isSmallDesktop ? 7 : 8;
  const count = isSpotOrderBook ? spotCount : isSwapOrderBook ? swapCount : swapCount;

  const swapSymbol = Swap.Info.getUnitText({ symbol: id });
  const coin = ORDER_BOOK_TYPES.SWAP == type ? swapSymbol : marketDetail?.coin;

  useEffect(() => {
    return () => {
      OrderBookEmitter.removeAllListeners(OrderBookEmitter.ORDER_BOOK_ITEM_PRICE);
    };
  }, []);

  return (
    <>
      <OrderWrap
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        isSwap={ORDER_BOOK_TYPES.SWAP === type}
        OrderBookGroupBtn={<DepthConfig onChange={setDepthConfig} type={type} />}
      >
        {activeIndex != 0 && <OrderPrice marketDetail={marketDetail} />}
        <div className={clsx('order-book-list-title')}>
          {(isSwapUsdt(id as string) || isSwapSLUsdt(id as string)) && (
            <>
              <span>
                {LANG('价格')}({marketDetail?.quoteCoin})
              </span>
              <span>
                {LANG('数量')}({coin})
              </span>
              <VolUnitSelect>
                <span className="select">
                  <div>
                    <div>
                      {LANG('累计')}({coin})
                    </div>
                    <Svg src="/static/images/common/arrow_down.svg" width={12} height={12} className={'icon'} />
                  </div>
                </span>
              </VolUnitSelect>
            </>
          )}
          {(isSwapCoin(id as string) || isSwapSLCoin(id as string)) && (
            <>
              <span>
                {LANG('价格')}({marketDetail?.quoteCoin})
              </span>
              <span>
                {LANG('数量')}({coin})
              </span>
              <VolUnitSelect>
                <span className="select">
                  <div>
                    <div>
                      {LANG('累计')}({coin})
                    </div>
                    <Svg src="/static/images/common/arrow_down.svg" width={12} height={12} className={'icon'} />
                  </div>
                </span>
              </VolUnitSelect>
            </>
          )}
          {isSpot(id as string) && (
            <>
              <span>
                {LANG('价格')}({quoteCoin})
              </span>
              <span>{LANG('数量')}</span>
              <span> {LANG('成交额')}</span>
            </>
          )}
        </div>
        <div className="order-book-content t1">
          {online && (
            <>
              {activeIndex === 0 && (
                <>
                  <OrderList
                    coinType={type}
                    type={OrderTypes.SELL}
                    count={count}
                    data={list}
                    depthConfig={depthConfig}
                  />
                  <OrderPrice marketDetail={marketDetail} />
                  <OrderList
                    coinType={type}
                    type={OrderTypes.BUY}
                    count={count}
                    data={list}
                    depthConfig={depthConfig}
                  />
                </>
              )}
              {activeIndex === 1 && (
                <>
                  <OrderList
                    coinType={type}
                    type={OrderTypes.BUY}
                    // count={list?.asks.length}
                    count={20}
                    data={list}
                    depthConfig={depthConfig}
                  />
                </>
              )}
              {activeIndex === 2 && (
                <>
                  <OrderList
                    coinType={type}
                    type={OrderTypes.SELL}
                    // count={list?.bids.length}
                    count={20}
                    data={list}
                    depthConfig={depthConfig}
                  />
                </>
              )}
            </>
          )}
        </div>
        {(activeIndex === 0 || isSpotOrderBook) && <OrderBookRates data={list} id={id} />}
        {/* {isSpotOrderBook && <OrderBookRates data={list} id={id} />} */}
      </OrderWrap>

      <style jsx>{`
        .order-book-list-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 16px;
          font-weight: 400;
          flex-shrink: 0;
          color: var(--text-tertiary);
          font-size: 10px;
          font-weight: 400;
          @media ${MediaInfo.mobile} {
            padding: 0 1rem;
            margin-top: 1rem;
            margin-bottom: 8px;
          }
          > span {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            flex: 1;
          }
          > span:nth-child(1) {
            text-align: left;
          }
          > span:nth-child(2) {
            padding-right: 16px;
            text-align: right;
          }
          > span:nth-child(3) {
            text-align: right;
          }

          .select {
            cursor: pointer;
            border-radius: 5px;

            > div {
              padding: 0 3px;
              @media ${MediaInfo.mobile} {
                padding: 0;
              }
              display: flex;
              align-items: center;
              height: 20px;
              justify-content: space-between;
              > div {
                text-align: right;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                flex: 1;
              }
            }

            :global(.icon) {
            }
          }
        }
        .order-book-content {
          flex: 1;
          /* display: flex;
          flex-direction: column; */
          &.t1 {
            :global(.order-price) {
              padding: 16px 16px;
            }
          }
        }
      `}</style>
    </>
  );
};
