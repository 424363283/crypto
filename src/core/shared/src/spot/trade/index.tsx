import { getSpotAssetApi, postSpotOpenOrderApi } from '@/core/api';
import { SideType, SpotOrderType, TRADE_TAB, TradeMap } from '@/core/shared';
import { getPlatform, getUUID } from '@/core/utils';
import { Account } from '../../account';
import { Position } from '../position';
import { LoadingType } from '../position/types';
import { state } from './state';
// 现货交易逻辑
export class Trade {
  public static id: string;

  public static state = state;

  public static async init(id: string) {
    if (Trade.id !== id) {
      Trade.state.id = id;
      await this.getSpotTradeItem(id);
      if (Account.isLogin) {
        await this.getBalance();
      }
    }
  }
  // 获取现货账户余额
  public static async getBalance() {
    const res = await getSpotAssetApi();
    if (res.code === 200) {
      const { data: spotList } = res;
      Trade.state.spotList = spotList;

      const quoteCoinItem = spotList?.find((item) => item.currency === Trade.state.quoteCoin);

      Trade.state.quoteCoinBalance = Number(quoteCoinItem?.balance) > 0 ? Number(quoteCoinItem?.balance) : 0;
      Trade.state.quoteCoinScale = quoteCoinItem?.scale || 0;

      const currentCoinItem = spotList?.find((item) => item.currency === Trade.state.coin);
      Trade.state.coinBalance = Number(currentCoinItem?.balance) > 0 ? Number(currentCoinItem?.balance) : 0;
      Trade.state.coinScale = currentCoinItem?.scale || 0;
    }
  }

  // 获取当前现货的合约信息
  public static async getSpotTradeItem(id: string) {
    const spotTradeItem = await TradeMap.getSpotById(id);

    if (spotTradeItem) {
      Trade.state.currentSpotContract = spotTradeItem;
      Trade.state.coin = spotTradeItem.coin;
      Trade.state.quoteCoin = spotTradeItem?.quoteCoin || '';
    }
  }

  /**
   * 按市价下单
   * @param side 买入还是卖出
   * @param type 市价还是限价
   * @param symbol 现货ID
   * @param price 价格
   * @param volume 数量
   */
  public static async openOrderByMarketPrice(side: SideType, type: SpotOrderType, symbol: string, price: number, volume: number) {
    const params = {
      identity: getUUID(16),
      symbol,
      side,
      type,
      price,
      volume,
      platform: getPlatform(),
    };
    try {
      const result = await postSpotOpenOrderApi(params);
      if (result.code == 200) {
        // 下单成功,刷新余额
        Trade.getBalance();
        Position.fetchPositionList(LoadingType.Show);
      }
      return result;
    } catch (e: any) {
      return {
        code: 500,
        message: e.message,
      };
    }
  }
  // 修改交易tab
  public static changeTradeTab(type: TRADE_TAB) {
    Trade.state.tradeTab = type;
  }
}
