import { resso } from '@/core/resso';
import { SpotItem } from '../../account/assets/types';
import { SpotTradeItem } from '../../trade/trade-map';
import { TRADE_TAB } from './types';

const _state = {
  /**
   * 商品ID
   */
  id: '',
  /**
   * 现货列表
   */
  spotList: [] as SpotItem[],
  /**
   * 当前现货的币种
   */
  coin: '',
  /**
   * 用于购买当前现货的币种
   */
  quoteCoin: '',
  /**
   * quoteCoin 余额
   */
  quoteCoinBalance: 0,
  /**
   * quoteCoin 精度
   */
  quoteCoinScale: 0,
  /**
   * 当前现货的剩余数量
   */
  coinBalance: 0,
  /**
   * 当前现货的精度
   */
  coinScale: 0,
  /**
   * 当前现货的合约信息
   */
  currentSpotContract: {} as SpotTradeItem,
  /**
   * 当前选择的 tab
   */
  tradeTab: TRADE_TAB.SPOT,
};

export const state = resso(_state);
