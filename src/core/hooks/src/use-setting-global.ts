import { getCommonSettingGlobalApi } from '@/core/api';
import { resso } from '@/core/resso';
import { Polling } from '@/core/utils/src/polling';
import { useEffect } from 'react';

type SettingGlobalData = {
  // spotMaintBanner: string;
  // swapMaintBanner: string;
  // liteMaintBanner: string;
  // globalMaintBanner: string;
  globalMaintEnable: boolean; // 全局维护
  liteMaintEnable: boolean; // 简单合约页面维护
  spotMaintEnable: boolean; // 现货页面维护
  swapMaintEnable: boolean; // 永续页面维护
  liteTradeEnable: boolean; // 简单合约交易维护
  spotTradeEnable: boolean; // 现货交易维护
  swapTradeEnable: boolean; // 永续交易维护
};

const store = resso<{ data: SettingGlobalData }>({
  data: {
    // spotMaintBanner: '',
    // swapMaintBanner: '',
    // liteMaintBanner: '',
    // globalMaintBanner: '',
    spotMaintEnable: false,
    liteMaintEnable: false,
    globalMaintEnable: false,
    swapMaintEnable: false,
    liteTradeEnable: true,
    spotTradeEnable: true,
    swapTradeEnable: true,
  },
});

let listenerCount = 0;

const polling = new Polling({
  interval: 30 * 1000, // 30s
  callback: async () => {
    const result = await getCommonSettingGlobalApi();
    if (result['code'] === 200) {
      store.data = result.data as SettingGlobalData;
    }
    if (listenerCount == 0) {
      polling.stop();
    }
  },
});

export const useSettingGlobal: () => SettingGlobalData = () => {
  useEffect(() => {
    listenerCount++;
    polling.start();
    return () => {
      listenerCount--;
      if (listenerCount == 0) {
        polling.stop();
      }
    };
  }, []);

  return store.data;
};
