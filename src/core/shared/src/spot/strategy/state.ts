import { resso } from '@/core/resso';
import { LIST_TYPE } from '../position/types';
import { CREATE_TYPE, GridAiItem, GridSymbolItem } from './types';

const _state = {
  /**
   * 现货网格支持列表
   */
  symbolList: [] as GridSymbolItem[],
  /**
   * 现货定投支持列表
   */
  investSymbolList: [] as GridSymbolItem[],
  /**
   * 现货定投支持Map
   */
  investSymbolMap: new Map() as Map<string, GridSymbolItem>,
  /**
   * 策略类型
   */
  selectType: null as LIST_TYPE | null,
  /**
   * 选择类型
   */
  createType: CREATE_TYPE.AI,
  /**
   * 当前所选币对信息
   */
  currentQuoteInfo: undefined as GridSymbolItem | undefined,
  /**
   * 余额
   */
  balance: 0,
  /**
   * 币种
   */
  baseCoin: '',
  /**
   * 用于购买当前现货的币种
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
