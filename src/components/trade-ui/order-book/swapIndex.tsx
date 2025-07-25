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
  SWAP = 'SWAP',
}
export type ListDataType = { asks: OrderBookItem[]; bids: OrderBookItem[] };
const store = resso({ list: { asks: [], bids: [] } });
export const OrderBook = ({ type, layoutH }: { type: ORDER_BOOK_TYPES, layoutH: any }) => {
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
      TradeMap.getSpotById(id).then((res) => {
        res && setQuoteCoin(res?.quoteCoin || '');
      });
    }
  }, [id]);
  const { list } = store;
  const setList = (v: any) => (store.list = v);




  useWs(SUBSCRIBE_TYPES.ws4001, (data) => {
    Swap.Utils.setNewestPrice(data?.price);
    setMarketDetail(data)
  });
  useWs(SUBSCRIBE_TYPES.ws7001, (data) => setList(data));

  const isSpotOrderBook = type === ORDER_BOOK_TYPES.SPOT;
  const isSwapOrderBook = type === ORDER_BOOK_TYPES.SWAP;
  // 显示数据的条数
  const showItemLen = useMemo(() => {
    return Math.floor((layoutH - 4) / (activeIndex === 0 ? 1 : 0.5));
  }, [activeIndex, layoutH]);

  const orderNumAdd = (showItemLen) => {
    if (!showItemLen) {
      return 10
    }
    // return showItemLen
    if (showItemLen <= 13) {

      return showItemLen ? showItemLen : 10
    }
    if (showItemLen > 13 && showItemLen <= 15) {
      return showItemLen + 1
    }
    if (showItemLen > 15 && showItemLen < 20) {
      return showItemLen + 1
    }
    if (showItemLen >= 20 && showItemLen < 24) {
      return showItemLen + 1
    }
    if (showItemLen >= 24) {
      return showItemLen + 2
    }
  }

  const count = orderNumAdd(showItemLen)


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
                <span className='select'>
                  <div>
                    <div>
                      {LANG('累计')}({coin})
                    </div>
                    <Svg src='/static/images/common/arrow_down.svg' width={12} height={12} className={'icon'} />
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
                <span className='select'>
                  <div>
                    <div>
                      {LANG('累计')}({coin})
                    </div>
                    <Svg src='/static/images/common/arrow_down.svg' width={12} height={12} className={'icon'} />
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
              <span>{LANG('成交额')}</span>
            </>
          )}
        </div>
        <div className='order-book-content t1'>
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
                    count={count * 2}
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
                    count={count * 2}
                    data={list}
                    depthConfig={depthConfig}
                  />
                </>
              )}
            </>
          )}
        </div>
        {isSwapOrderBook && <OrderBookRates data={list} id={id} />}
      </OrderWrap>

      <style jsx>{`
        .order-book-list-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
        
          padding: 8px 16px;
          padding-top:16px;
          font-weight: 400;
          flex-shrink: 0;
          color: var(--text_3);
          font-size: 10px;
          font-weight: 400;
          @media ${MediaInfo.mobile} {
            padding: 0 0 6.5px;
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
          &.t1{
            :global(.order-price){
              padding: 16px 16px;
            }
          }
        }
      `}</style>
    </>
  );
};
