import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.module.scss';
import { Input } from 'antd';
import Draggable from 'react-draggable';
import cn from 'clsx';
import { setDraggType } from '@/store/kline';
import { getKineState } from '@/store/kline';
import { getGlobalState } from '@/store/global';
import {
  ChooseTypes,
  PositionUnitTypes,
  PriceTypes,
  calcQuantity,
  coinToCont,
  contToCoin,
  contToUSDT,
  toNum,
  usdtToCont
} from '@/utils/futures';
import { useFutureOrderStore } from '@/store/future-order';
import { useCurrentEntrustStore, useFutureStore, useOrderSettingStore, usePositionStore } from '@/store';
import { format } from '@/utils';
import { ThemeContext } from '@/context';

import { useBalanceAmomnt } from '@/hooks/index';

type QuickOrderInfo = {
  quantity: string;
  buyCont: number;
  sellCont: number;
};
function QuickOrder() {
  const { theme } = useContext(ThemeContext);

  const [quantityError, setQuantityError] = useState('');
  const [orderInfo, setOrderInfo] = useState<QuickOrderInfo>({ quantity: '', buyCont: 0, sellCont: 0 });

  /** 盘口数据 */
  const { OrderBookList } = getKineState();

  /** 当前合约信息 */
  const { coinUnitLen, secondLevelUnderlyingName, usdtUnitLen, symbolSwapId, baseTokenFutures } = getGlobalState();
  const { contractMultiplier } = baseTokenFutures! || {};

  /** 订单配置 */
  const { positionUnitType, longLeverage, shortLeverage, positionType } = useFutureOrderStore();

  /** 快捷下单 */
  const { enableQuickOrder, setEnableQuickOrder } = useOrderSettingStore();

  /** 当前持仓 */
  const { positionList } = usePositionStore();

  /** 当前委托 */
  const { ordinaryList } = useCurrentEntrustStore();

  /** 可用余额 */
  const { futureTradeable } = useFutureStore();
  const { availableMargin } = useBalanceAmomnt();

  /** 盘口价 */
  const marketPrice = useMemo(() => {
    const { a, b } = OrderBookList;
    return {
      sellPrice: b?.length ? b[0][0] : 0,
      buyPrice: a?.length ? a[a.length - 1][0] : 0
    };
  }, [OrderBookList]);

  /** 可开多/空 总数 */
  const maxValues = useMemo(() => {
    let buyMax: number | string = '--';
    let sellMax: number | string = '--';
    let contBuyMax = 0;
    let contSellMax = 0;
    const balanceVal = Number(availableMargin) > 0 ? availableMargin : 0;
    // 开仓

    const available = +balanceVal || 0;

    const option = {
      available,
      symbolId: symbolSwapId,
      priceType: PriceTypes.MARKET_PRICE,
      currentList: ordinaryList,
      positionList
    };
    buyMax = calcQuantity({
      side: 'BUY',
      leverage: +longLeverage,
      ...option
    });
    sellMax = calcQuantity({
      side: 'SELL',
      leverage: +shortLeverage,
      ...option
    });
    if (+buyMax > 0) contBuyMax = +buyMax;
    else buyMax = '--';

    if (+sellMax > 0) contSellMax = +sellMax;
    else sellMax = '--';

    let unitLen = 0;
    let unit = ' ' + '张';
    if (positionUnitType == PositionUnitTypes.COIN) {
      unit = ' ' + secondLevelUnderlyingName;
      unitLen = coinUnitLen;
      if (contBuyMax) buyMax = contToCoin(buyMax, contractMultiplier, coinUnitLen);
      if (contSellMax) sellMax = contToCoin(sellMax, contractMultiplier, coinUnitLen);
    } else if (positionUnitType == PositionUnitTypes.USDT) {
      unit = ' USDT';
      unitLen = usdtUnitLen;
      if (contBuyMax) buyMax = contToUSDT(buyMax, contractMultiplier, usdtUnitLen, marketPrice.buyPrice);
      if (contSellMax) sellMax = contToUSDT(sellMax, contractMultiplier, usdtUnitLen, marketPrice.sellPrice);
    }

    return {
      buyMax: (+buyMax > 0 ? format(buyMax, unitLen) : '--') + unit,
      contBuyMax,
      sellMax: (+sellMax > 0 ? format(sellMax, unitLen) : '--') + unit,
      contSellMax
    };
  }, [futureTradeable, positionList, OrderBookList, positionUnitType]);

  let unit = '张';
  if (positionUnitType == PositionUnitTypes.COIN) unit = secondLevelUnderlyingName || '币';
  else if (positionUnitType == PositionUnitTypes.USDT) unit = 'USDT';

  /** 仓位单位切换 */
  useEffect(() => {
    handleUpdateOrderValue('');
  }, [positionUnitType]);

  /** 下单组件ref */
  const orderRef = useRef<OrderRef>();

  /** 快速下单 */
  const QuickOrderFun = (orderSide: 'BUY' | 'SELL') => {
    orderRef.current?.onSubmit({
      symbolSwapId,
      orderChoose: ChooseTypes.OPEN,
      orderSide,
      priceType: PriceTypes.MARKET_PRICE,
      positionType,
      price: marketPrice[orderSide == 'BUY' ? 'buyPrice' : 'sellPrice'],
      quantity: orderInfo.quantity,
      cont: '' + (orderSide == 'BUY' ? orderInfo.buyCont : orderInfo.sellCont),
      maxCont: '' + (orderSide == 'BUY' ? maxValues.contBuyMax : maxValues.contSellMax),
      leverage: orderSide == 'BUY' ? longLeverage : shortLeverage,
      hasTpsl: false,
      onError: (error: OrderError) => {
        if (error.quantity) {
          // 显示错误信息
          setQuantityError(error.quantity);
        }
      },
      onOk: () => handleUpdateOrderValue('')
    });
  };

  /** 数量处理 */
  const handleUpdateOrderValue = (e: any) => {
    let quantity = '';
    let sellCont = 0;
    let buyCont = 0;
    switch (positionUnitType) {
      case PositionUnitTypes.COIN:
        quantity = toNum(e, coinUnitLen);
        buyCont = sellCont = coinToCont(quantity, contractMultiplier);
        break;
      case PositionUnitTypes.USDT:
        quantity = toNum(e, usdtUnitLen);
        buyCont = usdtToCont(quantity, contractMultiplier, marketPrice.buyPrice);
        sellCont = usdtToCont(quantity, contractMultiplier, marketPrice.sellPrice);
        break;
      case PositionUnitTypes.CONT:
        quantity = toNum(e, 0).replace(/[^0-9]/g, '');
        buyCont = sellCont = +quantity;
        break;
    }
    setOrderInfo({
      quantity,
      sellCont,
      buyCont
    });
    setQuantityError('');
  };

  const themeStyle = useMemo(() => {
    return theme == 'light'
      ? {
          '--buy-content-bg': '#CEE4D9',
          '--sell-content-bg': '#F3E1E1'
        }
      : {
          '--buy-content-bg': '#414F48',
          '--sell-content-bg': '#544'
        };
  }, [theme]);

  return (
    <>
      {enableQuickOrder && marketPrice.buyPrice ? (
        <Draggable
          handle=".contract-quick-order-drag"
          onStart={() => setDraggType(true)}
          onStop={() => setDraggType(false)}
        >
          <div className={styles.quickOrderContainer} style={themeStyle as any}>
            <div className={cn(styles.leftIcon, 'contract-quick-order-drag')}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={{ color: 'var(--text-text-primary, #FFFFFF)' }}
              >
                <g opacity="0.2">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.00002 4.66667C5.73639 4.66667 6.33335 4.0697 6.33335 3.33333C6.33335 2.59695 5.73639 2 5.00002 2C4.26365 2 3.66669 2.59695 3.66669 3.33333C3.66669 4.0697 4.26365 4.66667 5.00002 4.66667ZM6.33335 8C6.33335 8.73637 5.73639 9.33333 5.00002 9.33333C4.26365 9.33333 3.66669 8.73637 3.66669 8C3.66669 7.26363 4.26365 6.66667 5.00002 6.66667C5.73639 6.66667 6.33335 7.26363 6.33335 8ZM6.33335 12.6667C6.33335 13.403 5.73639 14 5.00002 14C4.26365 14 3.66669 13.403 3.66669 12.6667C3.66669 11.9303 4.26365 11.3333 5.00002 11.3333C5.73639 11.3333 6.33335 11.9303 6.33335 12.6667ZM11.0001 4.66667C11.7365 4.66667 12.3334 4.0697 12.3334 3.33333C12.3334 2.59695 11.7365 2 11.0001 2C10.2637 2 9.66676 2.59695 9.66676 3.33333C9.66676 4.0697 10.2637 4.66667 11.0001 4.66667ZM12.3334 8C12.3334 8.73637 11.7365 9.33333 11.0001 9.33333C10.2637 9.33333 9.66676 8.73637 9.66676 8C9.66676 7.26363 10.2637 6.66667 11.0001 6.66667C11.7365 6.66667 12.3334 7.26363 12.3334 8ZM12.3334 12.6667C12.3334 13.403 11.7365 14 11.0001 14C10.2637 14 9.66676 13.403 9.66676 12.6667C9.66676 11.9303 10.2637 11.3333 11.0001 11.3333C11.7365 11.3333 12.3334 11.9303 12.3334 12.6667Z"
                    fill="currentColor"
                  />
                </g>
              </svg>
            </div>
            <div className={styles.quickBuyContent} onClick={() => QuickOrderFun('BUY')}>
              <div className={styles.quickTitle}>{'市价买入'}</div>
              <div>{marketPrice.buyPrice}</div>
            </div>
            <div className={cn(styles.quickValContent, quantityError ? 'error' : '')}>
              <div className={styles.quickTitle}>
                {'数量'}({unit})
              </div>
              <Input
                value={orderInfo.quantity}
                className={styles.quickValVal}
                placeholder={'请输入数量'}
                onChange={handleUpdateOrderValue}
              />
            </div>
            <div className={styles.quickSellContent} onClick={() => QuickOrderFun('SELL')}>
              <p className={styles.quickTitle}>{'市价卖出'}</p>
              <span>{marketPrice.sellPrice}</span>
            </div>
            <div className={styles.rightIcon} onClick={() => setEnableQuickOrder(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={{ color: 'var(--text-text-primary, #FFFFFF)' }}
              >
                <g opacity="0.2">
                  <path
                    d="M5.13807 4.19526C4.87772 3.93491 4.45561 3.93491 4.19526 4.19526C3.93491 4.45561 3.93491 4.87772 4.19526 5.13807L7.05719 8L4.19526 10.8619C3.93491 11.1223 3.93491 11.5444 4.19526 11.8047C4.45561 12.0651 4.87772 12.0651 5.13807 11.8047L8 8.94281L10.8619 11.8047C11.1223 12.0651 11.5444 12.0651 11.8047 11.8047C12.0651 11.5444 12.0651 11.1223 11.8047 10.8619L8.94281 8L11.8047 5.13807C12.0651 4.87772 12.0651 4.45561 11.8047 4.19526C11.5444 3.93491 11.1223 3.93491 10.8619 4.19526L8 7.05719L5.13807 4.19526Z"
                    fill="currentColor"
                  />
                </g>
              </svg>
            </div>
          </div>
        </Draggable>
      ) : null}

      {/* <CreateOrder ref={orderRef as any} /> */}
    </>
  );
}

export default QuickOrder;
