import { LANG } from '@/core/i18n';
import { CURRENT_TAB } from '../../../types';

export const useTabConfig = () => {
  const ALL_TABS = [
    {
      name: LANG('自选'),
      id: CURRENT_TAB.FAVORITE,
    },
    {
      name: LANG('现货'),
      id: CURRENT_TAB.SPOT_GOODS,
    },
    {
      name: LANG('永续合约'),
      id: CURRENT_TAB.PERPETUAL,
    },
    {
      name: LANG('简易合约'),
      id: CURRENT_TAB.LITE,
    },
    {
      name: LANG('杠杆代币'),
      id: CURRENT_TAB.ETF,
    },
  ];
  // 获取环境变量
  const enableLite = process.env.NEXT_PUBLIC_LITE_ENABLE === 'true';
  const HEADER_TABS_CONFIG = ALL_TABS.filter((tab) => {
    if (tab.id === CURRENT_TAB.LITE) {
      return enableLite;
    }
    return true;
  });
  return {
    HEADER_TABS_CONFIG,
  };
};
