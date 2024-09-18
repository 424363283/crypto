import { resso } from '@/core/resso';
import { CommissionType, HistoryRange, SpotListItem, SpotPositionListItem } from './types';

const _state = {
  /**
   * 当前委托列表
   */
  orderList: [] as SpotPositionListItem[],
  /**
   * 当前委托列表
   */
  orderHistoryList: [] as SpotPositionListItem[],
  /**
   * 历史成交列表
   */
  tradeHistoryList: [] as SpotPositionListItem[],
  /**
   * 现货资产列表
   */
  spotAssetsList: [] as SpotListItem[],
  /**
   * 列表是否在加载中
   */
  loading: false,
  /**
   * 是否隐藏其它交易对
   */
  hideOther: false,
  /**
   * 是否隐藏已撤销
   */
  hideRevoke: false,
  /**
   * 是否隐藏小额币种
   */
  hideMinimal: true,
  /**
   * 历史委托查询时间范围
   */
  historyRange: HistoryRange.DAY,
  /**
   * 当前委托——委托类型
   */
  positionCommissionType: CommissionType.All,
  /**
   * 历史委托——委托类型
   */
  historyCommissionType: CommissionType.All,
  /**
   * 网格持仓列表
   */
  spotGridList: [] as any[],
  /**
   * 定投持仓列表
   */
  spotInvestList: [] as any[],
};

export const state = resso(_state);
