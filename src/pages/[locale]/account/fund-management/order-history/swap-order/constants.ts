import { LANG } from '@/core/i18n';

// 永续历史委托 状态
export const SWAP_HISTORY_ORDER_STATUS: { [key: string]: string } = {
  0: LANG('下单中'),
  1: LANG('委托中'),
  2: LANG('已完成'),
  3: LANG('部分完成'),
  4: LANG('已取消'),
  5: LANG('委托取消'),
  6: LANG('已过期'),
  7: LANG('部分完成 部分取消'),
};

// 永续成交 历史委托 类型 最全的
export const SWAP_HISTORY_COMMISSION_TYPES = [
  {
    label: LANG('限价'),
    value: '1',
  },
  {
    label: LANG('市价'),
    value: '2',
  },
  {
    label: LANG('强平'),
    value: '3',
  },
  {
    label: LANG('市价止盈'),
    value: '4',
  },
  {
    label: LANG('市价止损'),
    value: '5',
  },
  // {
  //   label: LANG('追踪委托'),
  //   value: '6',
  // },
];
// 永续历史委托 类型
export const SWAP_HISTORY_ORDER_TYPES: { [key: string]: string } = {
  1: LANG('限价'),
  2: LANG('市价'),
  3: LANG('强平'),
  4: LANG('限价'),
  5: LANG('市价'),
};
export const SWAP_FINISHED_ORDER_TYPES: { [key: string]: string } = {
  1: LANG('限价'),
  2: LANG('市价'),
  3: LANG('强平'),
  4: LANG('限价'),
  5: LANG('市价'),
};

export const SWAP_FUNDS_TYPES: { [key: string]: string } = {
  0: LANG('现金'),
  1: LANG('体验金'),
  2: LANG('抵扣金'),
};

export const SWAP_HISTORY_COMMISSION_STATUS = [
  { label: LANG('下单中'), value: '0' },
  { label: LANG('委托中'), value: '1' },
  { label: LANG('已完成'), value: '2' },
  { label: LANG('部分完成'), value: '3' },
  { label: LANG('已取消'), value: '4' },
  { label: LANG('委托取消'), value: '5' },
  { label: LANG('已过期'), value: '6' },
  { label: LANG('部分完成 部分取消'), value: '7' }
];


