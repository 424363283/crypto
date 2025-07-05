import { resso } from '@/core/resso';
import { CREATE_TYPE, GridAiItem, GridSymbolItem } from './types';

const _state = {
  /**
   * 现货网格支持列表
   */
  symbolList: [] as GridSymbolItem[],
  /**
   * 选择类型
   */
  createType: CREATE_TYPE.AI,
  /**
   * 当前所选币对信息
   */
  currentQuoteInfo: undefined as GridSymbolItem | undefined,
  /**
   * 基础币
   */
  baseCoin: '',
  /**
   * 计价币
   */
  quoteCoin: '',
  /**
   * 现货网格AI推荐列表
   */
  aiList: [] as GridAiItem[],
  /**
   * 网格下单页面——高级参数折叠状态
   */
  collapse: false,
  /**
   * 网格下单页面——移动端下单弹窗显示状态
   */
  mobileStrategyModalVisible: false,
};

export const state = resso(_state);
