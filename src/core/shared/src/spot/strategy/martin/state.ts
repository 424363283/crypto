import { resso } from '@/core/resso';
import { MartinSymbolItem } from './types';

export type NS = number | string;

const _state = {
  /**
   * 现货马丁支持列表
   */
  martinSymbolList: [] as MartinSymbolItem[],
  /**
   * 当前所选的币对配置
   */
  symbolInfo: null as MartinSymbolItem | null,
  /**
   * 投入金额
   */
  investAmount: 0 as NS,
  /**
   * 是否显示高级参数
   */
  advancedVisible: false,
  /**
   * 马丁下单页面——移动端下单弹窗显示状态
   */
  mobileStrategyModalVisible: false,
  /**
   * 马丁表单数据
   */
  martinData: {
    /**
     * 基础币种
     */
    baseCoin: '',
    /**
     * 交易对
     */
    symbol: '',
    /**
     * 复制ID
     */
    copyId: '',
    /**
     * 复制索引
     */
    copyIndex: 0,
    /**
     * 首单金额
     */
    initQuote: '' as NS,
    /**
     * 跌多少加仓
     */
    triggerRate: 1 as NS,
    /**
     * 赚多少止盈
     */
    tpRate: 1.5 as NS,
    /**
     * 亏多少止损
     */
    slRate: '' as NS,
    /**
     * 加仓单金额
     */
    safetyQuote: '' as NS,
    /**
     * 最大加仓次数
     */
    safetyCount: 8 as NS,
    /**
     * 加仓单金额倍数
     */
    safetyQuoteRate: 1 as NS,
    /**
     * 加仓单价差倍数
     */
    safetyPriceRate: 1 as NS,
    /**
     * 触发价格
     */
    triggerPrice: '' as NS,
  },
};

export const state = resso(_state);
