import { NS } from '@/components/trade-ui/trade-view/spot';
import { resso } from '@/core/resso';
import dayjs from 'dayjs';
import { TradeTab } from '../summary/types';
import { TeamsListItem } from './types';

const _state = {
  /**
   * uid
   */
  uid: '',
  /**
   * username
   */
  username: '',
  /**
   * 起始时间
   */
  dateRangeStart: dayjs().subtract(29, 'day').format('YYYY-MM-DD') as string | null,
  /**
   * 终止时间
   */
  dateRangeEnd: dayjs().format('YYYY-MM-DD') as string | null,
  /**
   * 日期范围值
   */
  dateRangeValue: 30,
  /**
   * 币种
   */
  currency: 'USDT',
  /**
   * 类型
   */
  type: TradeTab.Swap,
  /**
   * 代理比例
   */
  ratio: 0,
  /**
   * 页码
   */
  page: 1,
  /**
   * 用户列表
   */
  userList: [] as TeamsListItem[],
  /**
   * 用户列表总数
   */
  total: 0,
  /**
   * 筛选条件弹窗是否打开
   */
  filterModalOpen: false,
  /**
   * 升点弹窗是否打开
   */
  upgradeModalOpen: false,
  /**
   * 排序类别
   */
  orderBy: '' as NS,
  /**
   * 排序方式
   */
  order: '',
  /**
   * 现货返佣比例列表
   */
  spotStepsList: [] as { disabled: boolean; value: number }[],
  /**
   * 永续返佣比例列表
   */
  swapStepsList: [] as { disabled: boolean; value: number }[],
  /**
   * 升点弹窗uid
   */
  upgradeUid: '',
  /**
   * 升点弹窗 type
   */
  upgradeType: TradeTab.Spot,
  /**
   * 升点弹窗 ratio
   */
  upgradeRatio: 0.05,
  /**
   * 展开行列表
   */
  listExpandedRows: [] as string[],
  /**
   * 查看下级列表
   */
  nextLevelList: [] as { uid: string; username: string }[],
};

export const state = resso(_state);
