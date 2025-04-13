import {
  delSwapOrderCancelAllApi,
  delSwapOrderCancelApi,
  getSwapGetPendingApi,
  getSwapPositionApi,
  postSwapPositionCloseAllApi,
  postSwapPositionCloseApi,
  postSwapReverseOpenPositionApi
} from '@/core/api';
import { Debounce } from '@/core/utils';
import { Account } from '../../../account';
import { infoInstance as Info } from '../info';
import { Utils } from '../utils';
import { OrderField, PendingItemType } from './field';
import { message, playAudio } from '@/core/utils';
import { LANG } from '@/core/i18n';

export class Order extends OrderField {
  _fetchPositionDebounce = { u: new Debounce(() => {}, 200), c: new Debounce(() => {}, 200) };
  _fetchPendingDebounce = { u: new Debounce(() => {}, 200), c: new Debounce(() => {}, 200) };

  init({ resso }: any) {
    this.store = resso({
      positionLoaded: false,
      position: { u: [], c: [] },
      positionLoading: { u: false, c: false },
      pending: { u: [], c: [] },
      pendingLoading: { u: false, c: false }
    });
  }

  async fetchPosition(usdt: boolean, { forced = false }: { forced?: boolean } = {}) {
    if (!Account.isLogin) {
      return;
    }
    if (!usdt) {
      return;
    }
    this.store.positionLoading[usdt ? 'u' : 'c'] = true;

    if (forced) {
      this._fetchPosition(usdt);
    } else {
      this._fetchPositionDebounce[usdt ? 'u' : 'c'].run(() => this._fetchPosition(usdt));
    }
  }

  async fetchPending(usdt: boolean, { forced = false }: { forced?: boolean } = {}) {
    if (!Account.isLogin) {
      return;
    }
    this.store.pendingLoading[usdt ? 'u' : 'c'] = true;
    if (forced) {
      this._fetchPending(usdt);
    } else {
      this._fetchPendingDebounce[usdt ? 'u' : 'c'].run(() => this._fetchPending(usdt));
    }
  }

  async _fetchPosition(usdt: boolean) {
    try {
      const result = await getSwapPositionApi(usdt);
      if (result.code === 200) {
        this.setPosition(usdt, result.data);
      }
      return result;
    } finally {
      this.store.positionLoading[usdt ? 'u' : 'c'] = false;
    }
  }

  async _fetchPending(usdt: boolean) {
    try {
      const result: any = await getSwapGetPendingApi(usdt, { size: 9999 });
      if (result?.code === 200) {
        this.setPending(usdt, result.data.pageData);
      }
      return result;
    } finally {
      this.store.pendingLoading[usdt ? 'u' : 'c'] = false;
    }
  }

  async cancelPending(item: PendingItemType, { refreshData }: { refreshData: boolean } = { refreshData: true }) {
    const _usdt = Info.getIsUsdtType(item.symbol);
    const result = await delSwapOrderCancelApi(
      { subWallet: item.subWallet, orderId: item.orderId, symbol: item.symbol, orderType: item.orderType },
      _usdt
    );
    if (result.code === 200 && refreshData) {
      this.fetchPosition(_usdt);
      this.fetchPending(_usdt);
    }
    return result;
  }

  async cancelPendingAll(usdt: boolean, symbol?: string, orderType?: number, subWallet?: string) {
    const result = await delSwapOrderCancelAllApi({ subWallet, symbol, orderType }, usdt);
    if (result.code === 200) {
      this.fetchPosition(usdt);
      this.fetchPending(usdt);
    }
    return result;
  }
  async closePositionAll(usdt: boolean, symbol?: string, subWallet?: string) {
    const result = await postSwapPositionCloseAllApi({ subWallet, symbol, source: Utils.getSource() }, usdt);
    // if (result.code === 200) {
    //   this.fetchPosition(usdt);
    //   this.fetchPending(usdt);
    // }
    return result;
  }
  async reverseOpenPosition(usdt: boolean, data?: any) {
    const result = await postSwapReverseOpenPositionApi(
      {
        subWallet: data.subWallet,
        symbol: data.symbol,
        source: Utils.getSource(),
        side: data['side'] == '1' ? '2' : '1'
      },
      usdt
    );
    if (result.code === 200) {
      this.fetchPosition(usdt);
    }
    return result;
  }

  async closePosition(data: any, params: any) {
    const _usdt = Info.getIsUsdtType(data.symbol);

    const result = await postSwapPositionCloseApi(
      {
        subWallet: data.subWallet,
        positionId: data['positionId'],
        side: data['side'] == '1' ? 1 : 2,
        symbol: data['symbol'].toUpperCase(),
        source: Utils.getSource(),
        ...params
      },
      _usdt
    );
    if (result.code === 200) {
      this.fetchPosition(_usdt);
      message.success(LANG('下单成功'));
    } else if (result.code !== 100008) {
      message.error(result.message || LANG('系统繁忙，请稍后再试'));
    }
    return result;
  }
}

export const orderInstance = new Order();
