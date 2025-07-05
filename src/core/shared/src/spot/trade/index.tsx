import { getSpotAssetApi, postSpotOpenOcoOrderApi, postSpotOpenOrderApi, postSpotOpenStopOrderApi } from '@/core/api';
import { EVENT_NAME, EVENT_TRACK } from '@/core/sensorsdata';
import { SideType, SpotOrderType, TRADE_TAB, TradeMap } from '@/core/shared';
import { getEtfCryptoInfo, getPlatform, getUUID, isSpotEtf } from '@/core/utils';
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
    if (res?.code === 200) {
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
   * 限价、市价下单
   * @param side 买入还是卖出
   * @param type 市价还是限价
   * @param symbol 现货ID
   * @param price 价格
   * @param volume 数量
   */
  public static async openOrder(side: SideType, type: SpotOrderType, symbol: string, price: number, volume: number, percent = 0) {
    const identity = getUUID(16);
    const params = {
      identity,
      symbol,
      side,
      type,
      price,
      volume,
      platform: getPlatform(),
    };

    const isEtf = isSpotEtf(symbol);
    const isMarket = type === 1;

    let trackParams: any = {
      order_id: identity,
      trade_direction: side === 1 ? '买入' : '卖出',
      tradepair_name: symbol.replace('_', '/'),
      trade_mode: isMarket ? '市价' : '限价',
      commission_price: String(isMarket ? 0 : price),
      quantity: String(isMarket ? volume : 0),
      trade_rate: percent + '%',
      total_amount: String(isMarket ? volume : Number(price.mul(volume))),
    };

    if (isEtf) {
      const { lever, isBuy } = getEtfCryptoInfo(symbol);
      trackParams = {
        ...trackParams,
        lvts_type: `${lever}X ${isBuy ? 'Long' : 'Short'}`,
      };
    }

    if (!isEtf) {
      EVENT_TRACK(EVENT_NAME.SPOT_INFO_SUBMIT, trackParams);
    }
    try {
      const result = await postSpotOpenOrderApi(params);
      if (result.code == 200) {
        // 下单成功,刷新余额
        Trade.getBalance();
        Position.fetchPositionList(LoadingType.Show);
        isEtf && EVENT_TRACK(EVENT_NAME.LVTS_INFO_SUBMIT, trackParams);
      }
      return result;
    } catch (e: any) {
      return {
        code: 500,
        message: e.message,
      };
    }
  }

  /**
   * 限价、市价止盈止损下单
   * @param side 买入还是卖出
   * @param type 市价还是限价
   * @param symbol 现货ID
   * @param triggerPrice 触发价
   * @param price 价格
   * @param volume 数量
   */
  public static async openStopOrder(side: SideType, type: SpotOrderType, symbol: string, triggerPrice: number, price: number, volume: number, percent: number) {
    const identity = getUUID(16);
    const params = {
      identity,
      symbol,
      side,
      type,
      triggerPrice,
      price,
      volume,
      platform: getPlatform(),
    };

    const isEtf = isSpotEtf(symbol);
    const isMarket = type === 1;

    let trackParams: any = {
      order_id: identity,
      trade_direction: side === 1 ? '买入' : '卖出',
      tradepair_name: symbol.replace('_', '/'),
      trade_mode: isMarket ? '市价止盈止损' : '限价止盈止损',
      commission_price: String(isMarket ? 0 : price),
      quantity: String(isMarket ? volume : 0),
      trade_rate: percent + '%',
      total_amount: String(isMarket ? volume : Number(price.mul(volume))),
      trigger_price: String(triggerPrice),
    };

    if (isEtf) {
      const { lever, isBuy } = getEtfCryptoInfo(symbol);
      trackParams = {
        ...trackParams,
        lvts_type: `${lever}X ${isBuy ? 'Long' : 'Short'}`,
      };
    }

    if (!isEtf) {
      EVENT_TRACK(EVENT_NAME.SPOT_INFO_SUBMIT, trackParams);
    }

    try {
      const result = await postSpotOpenStopOrderApi(params);
      if (result.code == 200) {
        // 下单成功,刷新余额
        Trade.getBalance();
        Position.fetchPositionList(LoadingType.Show);
        isEtf && EVENT_TRACK(EVENT_NAME.LVTS_INFO_SUBMIT, trackParams);
      }
      return result;
    } catch (e: any) {
      return {
        code: 500,
        message: e.message,
      };
    }
  }

  /**
   * OCO 下单
   * @param side 买入还是卖出
   * @param symbol 现货ID
   * @param triggerPrice 触发价
   * @param limitPrice 限价委托价格
   * @param price 止盈止损价格
   * @param volume 数量
   */
  public static async openOcoOrder(side: SideType, symbol: string, triggerPrice: number, limitPrice: number, price: number, volume: number) {
    const params = {
      identity: getUUID(16),
      symbol,
      side,
      triggerPrice,
      limitPrice,
      price,
      volume,
      platform: getPlatform(),
    };
    try {
      const result = await postSpotOpenOcoOrderApi(params);
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
  // 修改交易tab
  public static changeDownMenuValue(type: SpotOrderType) {
    Trade.state.downMenuValue = type;
  }
}
