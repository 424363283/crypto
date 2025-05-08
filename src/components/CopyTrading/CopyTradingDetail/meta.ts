import { LANG } from '@/core/i18n';
export const maginModelOpts = [
  {
    label: LANG('跟随交易员'),
    value: 1
  },
  {
    label: LANG('全仓'),
    value: 2
  },
  {
    label: LANG('逐仓'),
    value: 3
  }
];

export const leverModelOpts = [
  {
    label: LANG('跟随交易员'),
    value: 1
  },
  {
    label: LANG('固定倍数'),
    value: 2
  },
  {
    label: LANG('自定义杠杆'),
    value: 3
  }
];
export const copyStyleObj = {
  1: LANG('固定保证金'),
  2: LANG('数量比例')
};
