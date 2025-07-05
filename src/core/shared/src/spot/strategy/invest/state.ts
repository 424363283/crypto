import { resso } from '@/core/resso';
import { InvestSymbolItem } from './types';

const _state = {
  /**
   * 现货定投支持列表
   */
  investSymbolList: [] as InvestSymbolItem[],
  /**
   * 现货定投支持Map
   */
  investSymbolMap: new Map() as Map<string, InvestSymbolItem>,
  /**
   * 定投下单页面——定投币种列表数据
   */
  investDataList: [] as {
    symbol: string;
    amount: number | string;
  }[],
  /**
   * 定投下单页面——定投币种列表
   */
  investSymbolStringList: [] as string[],
  /**
   * 定投下单页面——定投周期
   */
  period: 4,
  /**
   * 定投下单页面——定投标题
   */
  title: '',
  /**
   * 定投下单页面——移动端下单弹窗显示状态
   */
  mobileStrategyModalVisible: false,
};

export const state = resso(_state);
