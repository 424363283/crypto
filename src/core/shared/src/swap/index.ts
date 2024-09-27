import { SUBSCRIBE_TYPES, useWs, useWs1050, useWs1060Position } from '@/core/network';
import { useWs1070 } from '@/core/network/src/hooks/use-ws-1070';
import { $axios } from '@/core/network/src/http/conf';
import { resso, useResso } from '@/core/resso';
import { Throttle, isBrowser } from '@/core/utils';
import { Account } from '../account';
import { assetsInstance } from './modules/assets';
import { Calculate } from './modules/calculate';
import { infoInstance } from './modules/info';
import { orderInstance } from './modules/order';
import { socketInstance } from './modules/socket';
import { tradeInstance } from './modules/trade';
import { Utils } from './modules/utils';

// 永续逻辑
export class Swap {
  static initialize = false;
  // 交易
  static Trade = tradeInstance;
  // 信息
  static Info = infoInstance;
  // 资产
  static Assets = assetsInstance;
  // 订单 持仓和委托
  static Order = orderInstance;
  // Socket
  static Socket = socketInstance;
  // 计算
  static Calculate = Calculate;
  // 通用
  static Utils = Utils;

  static init() {
    Swap.Trade.init({ resso });
    Swap.Info.init({ resso });
    Swap.Socket.init({ resso });
    Swap.Order.init({ resso });
    Swap.Assets.init({ resso });
  }

  static fetchInitData({ isUsdtType }: { isUsdtType?: boolean } = {}) {
    if (this.initialize) {
      return;
    }
    this.initialize = true;
    if (isBrowser) {
      Swap.Info.fetchTradeMap();
    }

    let dataReady = false;
    Swap.Info.fetchAgreement();
    return Swap.Info.subscribeAgreementIsAllow(() => {
      if (Account.isLogin && !dataReady) {
        dataReady = true;

        // TODO Swap.Info.getNotificationSetting();
        Swap.Info.fetchPositionType(true);
        // Swap.Info.fetchPositionType(false);
      }
    });
  }

  /*
   * @param assets 是否全部资产页
   */
  static useListener({ assets }: { assets?: boolean } = {}) {
    const ws1050Throttle = new Throttle(() => {}, 200);

    useResso(Swap.Info.store);
    if (!assets) {
      useWs(SUBSCRIBE_TYPES.ws7001, (data) => {
        if (data.asks?.[0] && data.bids?.[0]) {
          Swap.Info.store.depth = { sell1Price: Number(data.asks?.[0].price), buy1Price: Number(data.bids?.[0].price) };
        }
      });
    }
    useWs1050((data) => {
      ws1050Throttle.run(() => {
        Swap.Socket.store.data1050 = { ...data };
      });
    });
    useWs1060Position(() => {
      const isUsdtType = Swap.Trade.base.isUsdtType;
      if (assets) {
        Swap.Assets.fetchBalance(true);
        Swap.Order.fetchPosition(true);
        Swap.Assets.fetchBalance(true);
        Swap.Order.fetchPosition(false);
        return;
      }
      Swap.Assets.fetchBalance(isUsdtType);
      Swap.Order.fetchPending(isUsdtType);
      Swap.Order.fetchPosition(isUsdtType);
    });
    useWs1070((updates) => {
      const pendingU = [...Swap.Order.getPending(true)];
      const pending = [...Swap.Order.getPending(false)];
      const positionU = [...Swap.Order.getPosition(true)];
      const position = [...Swap.Order.getPosition(false)];
      updates.o.forEach((v: any) => {
        // "{\"uid\":814507938663514112,\"E\":1714129329338,\"e\":\"ORDER_TRADE_UPDATE\",
        // \"brand\":\"Y-MEX\",\"o\":[{\"S\":\"2\",\"c\":\"8605549203419848715\",\"s\":\"btc-usdt\"
        // ,\"sw\":\"W001\",\"X\":\"NEW\",\"x\":\"ORDER\",\"i\":8605549203419848715,\"cp\":true,
        // \"sp\":\"32050.05\",\"wt\":\"TRAILING_STOP_MARKET\",\"AP\":\"64100.1\"}]}"

        const isUsdt = /-usdt/i.test(v.s);
        (isUsdt ? pendingU : pending).forEach((item, index, arr) => {
          if (`${v.c}` === `${item.orderId}`) {
            arr[index] = { ...item, triggerPrice: v.sp };
          }
        });
        (isUsdt ? positionU : position).forEach((item, index, arr) => {
          if (`${v.sw}` === `${item.subWallet}` && `${v.s}`.toUpperCase() === `${item.symbol}`.toUpperCase() && `${v.S}` !== `${item.side}`) {
            arr[index] = { ...item, cbVal: Number(`${v.AP}`.sub(`${v.sp}`)) };
          }
        });
      });
      Swap.Order.setPosition(true, positionU);
      Swap.Order.setPosition(false, position);
    });
  }
}

Swap.init();

$axios.interceptors.request.use(async (request: any) => {
  if (/\/swap\//.test(request.url)) {
    const walletId = Swap.Info.getWalletId(Swap.Trade.base.isUsdtType);
    if (walletId) {
      request.headers['ppw'] = walletId;
    }
  }
  return request;
});
