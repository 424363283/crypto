import { LANG } from '@/core/i18n';
import { Store } from '@/core/store/src/resso';

export type PositionItemType = {
  side: string;
  symbol: string;
  accb: number;
  autoAddMargin: number;
  availPosition: string;
  avgCostPrice: string;
  basePrecision: string;
  baseShowPrecision: string;
  callbackValue: string | number | null;
  closeOrderId: string | null;
  closeOrderPrice: string | number | null;
  positionSide: string;
  closeOrderVolume: string | number | null;
  currentPosition: string;
  frozen: string | number | null;
  isClose: boolean | null;
  leverage: number;
  liquidationPrice: string;
  margin: string;
  marginType: number;
  markPrice: string;
  maxAddMargin: number;
  maxSubMargin: number;
  cbVal: number;
  subWallet: string;
  mm: number;
  mmr: number;
  orders: any[];
  positionId: string;
  r: number;
};
export type PendingItemType = {
  side: string;
  symbol: string;
  action: string;
  avgPrice: string;
  basePrecision: string;
  baseShowPrecision: string;
  subWallet: string;
  callbackRate: null;
  callbackValue: number | null;
  closePosition: boolean;
  ctime: number;
  dealVolume: number;
  direction: string | null;
  activationPrice: number;
  leverageLevel: number;
  marginType: number;
  mtime: number;
  orderId: string;
  orderType: number;
  otocoOrder: any[] | null;
  positionSide: string;
  price: string;
  priceType: number | null;
  reduceOnly: boolean;
  status: string;
  strategyType: string | null;
  triggerOrders: any[] | null;
  triggerPrice: string | null;
  type: string;
  volume: number;
};

export type StoreType = Store<{
  // 持仓数据
  positionLoaded: boolean;
  position: { u: PositionItemType[]; c: PositionItemType[] };
  positionLoading: { u: boolean; c: boolean };
  // 委托数据
  pending: { u: PendingItemType[]; c: PendingItemType[] };
  pendingLoading: { u: boolean; c: boolean };
}>;

export class OrderField {
  // late
  store: StoreType = {} as StoreType;

  getPositionLoading(usdt: boolean) {
    const { u, c } = this.store.positionLoading;
    return usdt ? u : c;
  }
  getPendingLoading(usdt: boolean) {
    const { u, c } = this.store.pendingLoading;
    return usdt ? u : c;
  }

  setPosition(usdt: boolean, data: PositionItemType[]) {
    this.store.position = { ...this.store.getSnapshot('position'), [usdt ? 'u' : 'c']: data };
    this.store.positionLoaded = true;
  }
  setPending(usdt: boolean, data: PendingItemType[]) {
    this.store.pending = { ...this.store.getSnapshot('pending'), [usdt ? 'u' : 'c']: data };
  }
  getPosition(usdt: boolean, { walletId, withHooks = true }: { walletId?: string; withHooks?: boolean } = {}): PositionItemType[] {
    const { u, c } = withHooks ? this.store.position : this.store.getSnapshot('position');

    const data = usdt ? u : c;
    if (walletId) {
      return data.filter((v: PendingItemType) => v.subWallet === walletId);
    }
    return data;
  }
  positionIsSame(v: PositionItemType, option: PositionItemType) {
    return v.symbol === option.symbol && v.positionSide === option.positionSide && v.subWallet === option.subWallet;
  }
  getPending(usdt: boolean, { walletId }: { walletId?: string } = {}) {
    const { u, c } = this.store.pending;

    const data = usdt ? u : c;
    if (walletId) {
      return data.filter((v) => v.subWallet === walletId);
    }
    return data;
  }

  getTwoWayPosition = ({ usdt, openPosition, code }: { usdt: boolean; openPosition: boolean; code: string }) => {
    let buyPosition: PositionItemType | undefined;
    let sellPosition: PositionItemType | undefined;
    const positionData = this.getPosition(usdt);

    if (!openPosition) {
      positionData.forEach((v) => {
        if (v.symbol.toUpperCase() === code) {
          if (v.side === '1') {
            buyPosition = v;
          } else {
            sellPosition = v;
          }
        }
      });
    }

    return { buyPosition, sellPosition };
  };

  formatPendingType(item: PendingItemType) {
    let strategyType = '';
    const isLimit = item.type === '1' || item.type === '4';
    let type: null | string = isLimit ? LANG('限价') : LANG('市价');

    if (`${item['strategyType']}` == '1') {
      strategyType = isLimit ? LANG('限价止盈') : LANG('市价止盈');
      type = null;
    } else if (`${item['strategyType']}` == '2') {
      strategyType = isLimit ? LANG('限价止损') : LANG('市价止损');
      type = null;
    }

    let side = '';
    if (item['positionSide'] == 'LONG') {
      side = item['side'] == '1' ? LANG('开多') : LANG('平多');
    } else if (item['positionSide'] == 'SHORT') {
      side = item['side'] == '1' ? LANG('平空') : LANG('开空');
    } else {
      if (item['reduceOnly'] == true) {
        side = item['side'] == '1' ? LANG('平空') : LANG('平多');
      } else {
        side = item['side'] == '1' ? LANG('开多') : LANG('开空');
      }
    }

    return { type: type, strategyType: strategyType, side: side };
  }
}
