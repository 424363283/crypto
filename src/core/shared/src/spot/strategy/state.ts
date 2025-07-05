import { resso } from '@/core/resso';
import { LIST_TYPE } from '../position/types';

const _state = {
  /**
   * 策略类型
   */
  selectType: null as LIST_TYPE | null,
  /**
   * 账户余额
   */
  balance: 0,
};

export const state = resso(_state);
