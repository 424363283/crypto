import { LANG } from "@/core/i18n";

export enum SPOT_HISTORY_TAB_KEY {
  CURRENT_COMMISSION = '0',
  HISTORY_COMMISSION = '1',
  HISTORY_TRANSACTION = '2'
}

export const SPOT_STATUS_MAP: { [key: string]: string } = {
  1: LANG('等待委托'),
  2: LANG('委托失败'),
  3: LANG('已委托'),
  4: LANG('等待撤单'),
  5: LANG('正在撤单'),
  6: LANG('全部撤单'),
  7: LANG('部分成交'),
  8: LANG('全部成交')
};
export const spotStatus: { [key: string]: number } = {
  1: 1,
  2: 3,
  3: 8,
  4: 4,
  5: 6,
  6: 2,
  7: 7
};
