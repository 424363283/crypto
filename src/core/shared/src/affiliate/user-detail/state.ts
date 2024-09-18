import { resso } from '@/core/resso';
import dayjs from 'dayjs';
import { UserListItem } from './types';

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
  dateRangeStart: dayjs().subtract(6, 'day').format('YYYY-MM-DD') as string | null,
  /**
   * 终止时间
   */
  dateRangeEnd: dayjs().format('YYYY-MM-DD') as string | null,
  /**
   * 日期范围值
   */
  dateRangeValue: 7,
  /**
   * 来源
   */
  source: '',
  /**
   * 币种
   */
  currency: 'USDT',
  /**
   * 页码
   */
  page: 1,
  /**
   * 用户列表
   */
  userList: [] as UserListItem[],
  /**
   * 用户列表总数
   */
  total: 0,
  /**
   * 筛选条件弹窗是否打开
   */
  filterModalOpen: false,
};

export const state = resso(_state);
