import { create } from 'zustand';
import { createSelectors } from './zustand-createSelectors';
import { Copy } from '@/core/shared';
import { USER_BENEFITS, FILTER_INFO, LEAD_TRADER } from '@/core/shared/src/copy/types';
import { mergedArray } from '@/core/utils/src/mergedArray';
import { LANG } from '@/core/i18n';
//跟单用户
export interface CopyTrader {
  id: number;
  name: string; //头像
}
interface CopyTradingSwapState {
  maxCompareCount: number;
  filterInfo: FILTER_INFO;
  copyTradeInfo: {
    ranks: LEAD_TRADER[]; // 跟单首页列表
    currentPage: number;
    totalCount: number;
    klineStatistics: [];
  };
  isCopyTrader: boolean;
  traderStatistics: USER_BENEFITS;
  fetchRanks: (T: any) => Promise<void>;
  fetchShareTrader: () => Promise<void>;
  fetchTraderStatistics: () => Promise<void>;
  fetchCopyTradeStatistic: Function;
  setFilterInfo: Function;
}

const useCopyTradingSwapStroeBase = create<CopyTradingSwapState>()(set => ({
  maxCompareCount: 4,
  copyTradeInfo: {
    ranks: [],
    currentPage: 0,
    totalCount: 0,
    klineStatistics: []
  },
  isCopyTrader: false, // 是否是跟单员
  traderStatistics: { profitAmount7: 0, profitRate7: 0, profitAmount: 0 } as USER_BENEFITS,
  filterInfo: {
    selectDate: { label: LANG('{days}日', { days: 7 }), value: 7 },
    timeType: 7,
    traderType: 3,
    hideTrader: true,
    contractInfo: '',
    followAssetMin: 0,
    followAssetMax: 99,
    traderAssetMin: 0,
    traderAssetMax: 99,
    profitAmount: 50,
    profitRate: 30,
    victoryRateMin: 2,
    victoryRateMax: 40,
    settledDays: 7,
    userTag: '',
    page: 1,
    size: 6,
    sortType: '',
    nikeName: ''
  },
  fetchRanks: async (params:any) => {
    // await http request data
    const currentState = useCopyTradingSwapStroeBase.getState();
    const res: any = await Copy.getAllTraders(params);
    if (res?.code === 200) {
      const reslutAll = res.data;
      const copyTradingList = reslutAll.pageData;
      const ids = copyTradingList.map((item: any) => item.uid);
      if (ids.length > 0) {
        currentState.fetchCopyTradeStatistic({ cycle: currentState.filterInfo.timeType, uids: ids.join(',') },reslutAll);
      } 
    }
  },
  // 查询周期性带单员数据 K线
  fetchCopyTradeStatistic: async (params: any,reslutAll:any) => {
    const currentState = useCopyTradingSwapStroeBase.getState();
    const copyTradList = reslutAll.pageData.map((item: any) => {
    const symbolList =
        item.contractInfo && Object.values(JSON.parse(item.contractInfo)).map((key: any) => key.includes('/usdt')? key.replace('/usdt', '') : key.replace('-USDT', ''));
      return {
        ...item,
        symbolList: symbolList
      };
    });
    const res2 = await Copy.fetchCopyTradeuserStatisticsList(params);
    if (res2?.code === 200) {
      const result:any = mergedArray(copyTradList, res2.data,'uid')
      set(state => ({
        copyTradeInfo: {
          ranks: result,
          currentPage: reslutAll.currentPage,
          totalCount: reslutAll.totalCount,
          klineStatistics: res2.data
        }
      }));
    } else {
      set(state => ({
        copyTradeInfo: {
          ranks: copyTradList,
          currentPage: reslutAll.currentPage,
          totalCount: reslutAll.totalCount,
          klineStatistics: res2.data
        }
      }));
    }
  },
  fetchShareTrader: async () => {
    const shareTrader = await Copy.getIsShareTrader();
    if (shareTrader?.code === 200) {
      set(state => ({ isCopyTrader: shareTrader.data.isApply === 1 }));
    }
  },
  // 查询带单员详情 周期信息
  fetchTraderStatistics: async () => {
    if (!Copy.isLogin) return
    const userInfo: any = Copy.getUserInfo();
    const summary = await Copy.fetchCopyTradeuserStatisticsSummary({ cycle: 7, uid: userInfo?.user?.uid });
    if (summary?.code === 200) {
      set(state => ({ traderStatistics: summary.data }));
    }
  },
  setFilterInfo: (data: FILTER_INFO) => {
    set(state => ({ filterInfo: data }));
  }
}));

export const useCopyTradingSwapStore = createSelectors(useCopyTradingSwapStroeBase);
