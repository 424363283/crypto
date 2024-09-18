import { resso } from '@/core/resso';
import dayjs from 'dayjs';
import { RecordLinkListItem } from './types';

export enum TYPES {
  /**
   * 全部
   */
  ALL = '',
  /**
   * 现货
   */
  SPOT = 2,
  /**
   * 合约
   */
  SWAP = 3,
}

export enum TIME_TAB {
  /**
   * 今天
   */
  TODAY = 'today',
  /**
   * 近七天
   */
  ONE_WEEK = 'one_week',
  /**
   * 一个月
   */
  ONE_MONTH = 'one_month',
}

const _state = {
  /**
   * 下级代理UID
   */
  uid: '',
  /**
   * 下级用户名
   */
  sname: '',
  /**
   * 类型
   */
  type: TYPES.ALL,
  /**
   * 起始时间
   */
  dateGe: dayjs().subtract(6, 'day').format('YYYY-MM-DD') as string | null,
  /**
   * 终止时间
   */
  dateLe: dayjs().format('YYYY-MM-DD') as string | null,
  /**
   * 时间范围
   */
  timeTab: TIME_TAB.ONE_WEEK,
  /**
   * 记录列表
   */
  recordList: [] as RecordLinkListItem[],
  /**
   * 记录条数
   */
  recordListTotal: 0,
  /**
   * 记录列表页码
   */
  page: 1,
};

export const state = resso(_state);
