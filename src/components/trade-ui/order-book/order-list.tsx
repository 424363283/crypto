import { FORMULAS } from '@/core/formulas';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { OrderBookItem, Swap, TradeMap } from '@/core/shared';
import { Position } from '@/core/shared/src/spot/position';
import { formatDefaultText, formatNumber2Ceil, isSpot, isSwap } from '@/core/utils';
import { Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { ListDataType, ORDER_BOOK_TYPES } from '.';
import { OrderItem } from './order-item';
import { OrderTypes } from './types';

export const OrderList = ({
  type,
  count,
  data,
  coinType,
  depthConfig,
}: {
  type: OrderTypes;
  count: number;
  data: ListDataType;
  coinType: ORDER_BOOK_TYPES;
  depthConfig?: number | null;
}) => {
  data = { ...data };
  if (depthConfig) {
    if (type == OrderTypes.BUY) {
      data.bids = FORMULAS.SWAP.orderBookConcat(true, depthConfig, data.bids);
    }
    if (type == OrderTypes.SELL) {
      data.asks = FORMULAS.SWAP.orderBookConcat(false, depthConfig, data.asks);
    }
  }

  const accAmount = useRef(0); // 累加量 缓存
  const asks = data.asks.slice(0, count);
  const bids = data.bids.slice(0, count);
  const list = {
    asks: [...asks].concat(new Array(count - asks.length).fill(new OrderBookItem())),
    bids: bids.concat(new Array(count - bids.length).fill(new OrderBookItem())),
  };
  const maxAmount = [...list.asks, ...list.bids].reduce((acc, cur) => acc + +cur.amount, 0);

  const { id } = useRouter().query;
  const [hoverCount, setHoverCount] = useState<null | number>(null);
  const [quoteCoin, setQuoteCoin] = useState('');
  const [coin, setCoin] = useState('');

  useEffect(() => {
    if (isSpot(id)) {
      TradeMap.getSpotById(id).then((res) => {
        if (res) {
          setQuoteCoin(res?.quoteCoin || '');
          setCoin(res.coin);
        }
      });
    }
  }, [id]);
  const inSpot = isSpot(id);
  const inSwap = isSwap(id);
  const showTips = inSpot || isSwap(id);

  /// swap
  const swapIsUsdtType = Swap.Info.getIsUsdtType(id);
  const swapCryptoData = Swap.Info.getCryptoData(id);
  const swapCoinVolDigit = Swap.Info.getVolumeDigit(id, { isVolUnit: false });
  const swapUsdtVolDigit = Swap.Info.usdtVolumeDigit;
  const swapPriceUnitText = Swap.Info.getPriceUnitText(swapIsUsdtType);

  const renderContent = () => {
    const data: any = {};
    if (inSpot) {
      let totalCoin = 0;
      let totalQuoteCoin = 0;
      let totalAmount: number | string = 0;
      let digit = 0;
      let priceDigit = 0;
      let avePrice: number | string = 0;
      if (hoverCount !== null) {
        list[type].slice(0, Number(hoverCount) + 1).forEach((item) => {
          totalCoin = Number(totalCoin.add(item.amount));
          totalQuoteCoin = Number(totalQuoteCoin.add(item.price));
          const currentDigit = Math.max(item.priceDigit, item.amountDigit);
          priceDigit = item.priceDigit;
          digit = currentDigit > 5 ? 5 : currentDigit;
          totalAmount = Number(totalAmount.add(item.price.mul(item.amount)));
        });
      }
      avePrice = totalAmount.div(totalCoin);

      data.price = avePrice.toFormat(priceDigit);
      data.coinTotal = formatDefaultText(totalCoin);
      data.usdtTotal = totalAmount.toFormatUnit(digit);
      data.coin = coin;
      data.quoteCoin = quoteCoin;
    }
    if (inSwap) {
      let totalCoin = 0;
      let totalQuoteCoin = 0;
      let totalAmount: number | string = 0;
      let priceDigit = 0;
      let avePrice: number | string = 0;

      // U本位：  合计 USDT=买1价格*买1数量+买2价格*买2*刷量.....买n价格*买n数量； 合计币数量=sum(每一档的张数*面值)；均价=合计/总数量
      // 币本位：  合计USD=合集张数*面值；合计币数量=sum(每一档数量张数*面值/价格)；均价= 合计USD/合计币数量
      if (hoverCount !== null) {
        list[type].slice(0, Number(hoverCount) + 1).forEach((item: OrderBookItem) => {
          const amount = Number(item.amount) ? item.amount : 0;
          const price = Number(item.price) ? item.price : 0;
          priceDigit = item.priceDigit;
          totalCoin = Number(
            totalCoin.add(
              swapIsUsdtType
                ? amount.mul(swapCryptoData.contractFactor)
                : amount.mul(swapCryptoData.contractFactor).div(price)
            )
          );
          totalQuoteCoin = Number(
            totalQuoteCoin.add(
              swapIsUsdtType
                ? formatNumber2Ceil(amount.mul(swapCryptoData.contractFactor).mul(price), swapUsdtVolDigit)
                : amount.mul(swapCryptoData.contractFactor)
            )
          );
        });
      }

      avePrice = totalCoin && totalQuoteCoin ? totalQuoteCoin.div(totalCoin) : 0;
      data.price = avePrice.toFormat(priceDigit);
      data.coinTotal = totalCoin.toFormat(swapCoinVolDigit);
      data.usdtTotal = totalQuoteCoin.toFormatUnit(swapUsdtVolDigit);
      data.coin = swapCryptoData.coin;
      data.quoteCoin = swapPriceUnitText;
    }
    return (
      <ItemTipsContent
        price={data.price}
        coinTotal={data.coinTotal}
        usdtTotal={data.usdtTotal}
        coin={data.coin}
        quoteCoin={data.quoteCoin}
      />
    );
  };
  const { orderList } = Position.state;
  const swapOrderList = Swap.Order.getPending(swapIsUsdtType);

  return (
    <>
      <div className='order-list'>
        {list[type].map((item: OrderBookItem, index: number) => {
          if (index === 0) {
            accAmount.current = +item.amount;
          } else {
            accAmount.current += +item.amount;
          }

          let showDot = false;
          if (inSwap && swapOrderList.some((i) => i.price == item.price)) {
            showDot = true;
          }
          if (inSpot && orderList.some((i) => i.price == item.price)) {
            showDot = true;
          }
          if (showTips) {
            return (
              <Tooltip
                key={index}
                placement='left'
                title={() => renderContent()}
                mouseEnterDelay={0}
                mouseLeaveDelay={0}
                overlayClassName='order-book-tooltip'
              >
                <div
                  onMouseEnter={() => setHoverCount(index)}
                  onMouseLeave={() => setHoverCount(null)}
                  className={`${Number(hoverCount) > index ? 'active' : ''}`}
                >
                  <OrderItem
                    item={item}
                    accAmount={accAmount.current}
                    maxAmount={maxAmount}
                    type={type}
                    showDot={showDot}
                  />
                </div>
              </Tooltip>
            );
          } else {
            return (
              <OrderItem
                key={index}
                item={item}
                accAmount={accAmount.current}
                maxAmount={maxAmount}
                type={type}
                showDot={showDot}
              />
            );
          }
        })}
      </div>

      <style jsx>{`
        .order-list {
          display: flex;
          flex-direction: ${type == OrderTypes.BUY ? 'column' : 'column-reverse'};
          flex: 1;
        }
        :global(.order-book-tooltip) {
          :global(.ant-tooltip-inner) {
            width: 227px;
            height: 92px;
            word-break: break-word;
            font-size: 12px;
            padding: 10px;
            font-weight: 400;
            background-color: var(--theme-background-color-2-3);
            color: var(--theme-font-color-1);
          }
          :global(.ant-tooltip-arrow::before) {
            background: var(--theme-background-color-2-3);
          }
          :global(.tooltip-text) {
            cursor: pointer;
          }
        }
        .active {
          background-color: var(--theme-order-book-hover);
        }
      `}</style>
    </>
  );
};

const ItemTipsContent = ({
  price,
  coinTotal,
  usdtTotal,
  coin,
  quoteCoin,
}: {
  price?: string;
  coinTotal?: string;
  usdtTotal?: string;
  coin?: string;
  quoteCoin?: string;
}) => {
  return (
    <>
      <div className='content'>
        <div>
          <span>{LANG('均价')}</span>
          <span>≈ {price ?? ''}</span>
        </div>
        <div>
          <span>
            {LANG('合计')} {coin ?? ''}
          </span>
          <span>{coinTotal ?? ''}</span>
        </div>
        <div>
          <span>
            {LANG('合计')} {quoteCoin ?? ''}
          </span>
          <span>{usdtTotal ?? ''}</span>
        </div>
      </div>
      <style jsx>{`
        .content {
          > div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            line-height: 14px;
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      `}</style>
    </>
  );
};
