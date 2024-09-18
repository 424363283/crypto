import { resso } from '@/core/resso';
import { TPlanCommission } from '@/core/shared';
import { MarketsMap } from '../../markets/types';
import { LiteTradeItem } from '../../trade/trade-map';
import { InAssetsType, LiteListItem, LiteTabType } from './types';

const _state = {
  /**
   * 是否登录
   */
  isLogin: false,
  /**
   * 选中的 Tab
   * @description 把这个状态放进来，是因为需要和交易面板有个联动，下单成功时需要触发当前已选中 tab 的数据更新
   */
  selectedTab: LiteTabType.REAL,
  /**
   * 持仓 List
   */
  positionList: [] as LiteListItem[],
  /**
   * 持仓 List
   */
  pendingList: [] as TPlanCommission[],
  /**
   * 历史成交 List
   */
  historyList: [] as LiteListItem[],
  /**
   * 保存分享弹窗里的数据
   */
  shareModalData: null as null | LiteListItem,
  /**
   * 保存设置弹窗里的数据
   */
  settingModalData: null as null | LiteListItem,
  /**
   * 增加保证金弹窗里的数据
   */
  addMarginModalData: null as null | LiteListItem,
  /**
   * 列表是否在加载中
   */
  loading: false,
  /**
   * 行情列表 map
   */
  marketMap: {} as MarketsMap,
  /**
   * 是否是在资产页面使用
   */
  inAssets: InAssetsType.NotInAssets,
  /**
   * 是否隐藏其它交易对
   */
  hideOther: false,
  /**
   * 简单合约商品 map
   */
  liteTradeMap: new Map() as Map<string, LiteTradeItem>,
};

export const state = resso(_state);

export const logState = () => {
  const obj: any = {};
  Object.keys(_state).forEach((key) => {
    if (['subscribe', 'unsubscribe'].includes(key)) return;
    obj[key] = state[key];
  });
  return obj;
};
