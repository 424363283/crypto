import { isNumber, isServerSideRender } from '@/utils';
import {
  ChooseTypes,
  EntrustPriceTypes,
  PositionTypes,
  PositionUnitTypes,
  PriceTypes,
  TPSL_PRICE_TYPES,
  TimeInForceTypes,
  TriggerConditionTypes,
  isPriceType
} from '@/utils/futures';
import { StoreApi, UseBoundStore, create } from 'zustand';

/**
 * 下单区Store
 */
export const DEFAULT_FUTURE_ORDER_STORE: IFutureOrderConfig = {
  priceType: PriceTypes.MARKET_PRICE,
  orderChoose: ChooseTypes.OPEN,
  positionType: PositionTypes.CROSS,
  positionUnitType: PositionUnitTypes.COIN, //当前交易单位类型
  timeInForce: TimeInForceTypes.GTC,
  currentEntrustPriceType: EntrustPriceTypes.LIMIT,
  triggerConditionType: TriggerConditionTypes.LatestPrice,
  longLeverage: '',
  shortLeverage: '',
  enableStopProfit: false,
  enableStopLoss: false,
  slLimitPriceType: TPSL_PRICE_TYPES.MP,
  spLimitPriceType: TPSL_PRICE_TYPES.MP,
  slLimitPrice: '',
  spLimitPrice: '',
  slTriggerConditionType: TPSL_PRICE_TYPES.LP,
  spTriggerConditionType: TPSL_PRICE_TYPES.LP,
  stopProfitPrice: '',
  stopLossPrice: '',
  progress: 0,
  buyQuantity: '',
  sellQuantity: '',
  triggerPrice: '',
  price: '',
  contBuyQuantity: '',
  contSellQuantity: '',
  contBuyMax: 0,
  contSellMax: 0,
  force: false,
  errors: {}
};

export type FutureOrderStore = IFutureOrderConfig & {
  updateFutureOrderStore: (store: Partial<FutureOrderStore>) => void;
};

export const useFutureOrderStore: UseBoundStore<StoreApi<FutureOrderStore>> = create(set => {
  const initStore = Object.assign({}, DEFAULT_FUTURE_ORDER_STORE);
  if (!isServerSideRender()) {
    // 仓位单位
    const buePositionUnit = localStorage.getItem('bue_position_unit');
    if (isPriceType(buePositionUnit)) initStore.positionUnitType = +buePositionUnit!;

    try {
      const storeageOrder = localStorage.getItem('buy_item');
      if (storeageOrder) {
        const tempOrder: any = JSON.parse(storeageOrder);

        // 下单类型
        const type = tempOrder.type;
        if (isPriceType(type)) initStore.priceType = +type;

        // 价格
        const price = tempOrder.price;
        if (price && isNumber(price)) initStore.price = tempOrder.price;
      }
    } catch (error) {}
  }

  return {
    ...initStore,
    updateFutureOrderStore: (store: Partial<FutureOrderStore>) => set(state => ({ ...state, ...store })),
    resetFutureOrderStore: () => set(state => ({ ...state, ...DEFAULT_FUTURE_ORDER_STORE }))
  };
});

export function getFutureOrderState() {
  return useFutureOrderStore.getState();
}
