import { create } from 'zustand';
import { createSelectors } from './zustand-createSelectors';
import { Copy } from '@/core/shared';
import { USER_BENEFITS, FILTER_INFO, LEAD_TRADER, BRING_SETING_DATA } from '@/core/shared/src/copy/types';
import { mergedArray } from '@/core/utils/src/mergedArray';
import { FILTERINFO_DEFAULT } from '@/core/shared/src/copy/constants';
import {
  CopyTabActive,
  CopyTradeSetting,
  CopyTradeType
} from '@/components/CopyTrading/CopyTradingDetail/Components/types';
import { ContractType } from '@/components/CopyTrading/CopyTradingDetail/Components/types';
//跟单用户
export interface CopyTrader {
  id: number;
  name: string; //头像
}
interface CopyTradingSwapState {
  maxCompareCount: number;
  filterInfo: FILTER_INFO;
  tabsActive: string;
  bringUserData: object;
  copyTradeInfo: {
    ranks: LEAD_TRADER[]; // 跟单首页列表
    currentPage: number;
    totalCount: number;
    klineStatistics: [];
  };
  swapCoinList: [];
  noQueryPostion: string;
  positionList: [];
  marketObj: object;
  positionUnrealisedPNLObj: object;
  unrealisedPNLObj: string;
  setUnrealisedPNLObj: Function;
  setMarketObj: Function;
  setNoQueryPostion: Function;
  setPositionList: Function;
  fetchCurrentPosition: Function;
  traderDetail: BRING_SETING_DATA;
  isCopyTrader: boolean;
  isFetchCopyTrader: boolean;
  traderStatistics: USER_BENEFITS;
  fetchRanks: (T: any) => Promise<void>;
  fetchShareTrader: () => Promise<void>;
  fetchTraderStatistics: () => Promise<void>;
  fetchContractList: () => Promise<void>;
  getTraderDetail: (T: any) => Promise<void>;
  fetchCopyTradeStatistic: Function;
  setFilterInfo: Function;
  sethasAllClose: Function;
  setfetchAllClose: Function;
  setPositionUnrealisedPNLObj: Function;
  setFetchRefresh: Function;
  setTabsActive: Function;
  hasAllClose: boolean;
  fetchAllClose: Boolean;
  isRefresh: Boolean;
  searchKey: string;
  setSearchKey: Function;
}

const useCopyTradingSwapStroeBase = create<CopyTradingSwapState>()(set => ({
  maxCompareCount: 4,
  copyTradeInfo: {
    ranks: [],
    currentPage: 0,
    totalCount: 0,
    klineStatistics: []
  },
  swapCoinList: [],
  traderDetail: {
    contractInfo: '', // 带单币种
    shareStatus: 0, // 带单状态：0关闭，1开启，2禁止带单
    shareRoyaltyRatio: 0, // 分润比例
    maxCopyTraderCount: 0, // 最大跟单人数
    copyMinAvailableMargin: 0, // 跟单员最低可用保证金
    nickname: '', // 昵称
    description: '', // 带单备注
    contractList: [] // 合约列表
  },
  isCopyTrader: false, // 是否是跟单员
  isFetchCopyTrader: false, // 是否请求了是否跟单员接口
  hasAllClose: false, // 是否有全平按钮
  fetchAllClose: false, // 是否请求一键全平
  isRefresh: false, //是否需要刷新数据
  bringUserData: {}, // 带单员信息
  searchKey: '', // 搜索key
  tabsActive: CopyTabActive.current, // tab 当前tab切换
  traderStatistics: { profitAmount7: 0, profitRate7: 0, profitAmount: 0 } as USER_BENEFITS,
  filterInfo: {},
  unrealisedPNLObj: '', // 根据标记 算出已实现盈亏
  marketObj: {}, //市场行情对象
  positionUnrealisedPNLObj: {}, //市场行情对象
  noQueryPostion: '', // 没有查询条件的当前持仓
  positionList: [], // 当前持仓列表
  fetchRanks: async (params: any) => {
    // await http request data
    const currentState = useCopyTradingSwapStroeBase.getState();
    const res: any = await Copy.getAllTraders(params);
    if (res?.code === 200) {
      const reslutAll = res.data;
      const copyTradingList = reslutAll.pageData;
      const ids = copyTradingList.map((item: any) => item.uid);
      if (ids.length > 0) {
        currentState.fetchCopyTradeStatistic(
          { cycle: currentState.filterInfo.timeType, uids: ids.join(',') },
          reslutAll
        );
      } else {
        set(state => ({
          copyTradeInfo: {
            ranks: [],
            currentPage: 0,
            totalCount: res.totalCount,
            klineStatistics: []
          }
        }));
      }
    }
  },
  // 查询周期性带单员数据 K线
  fetchCopyTradeStatistic: async (params: any, reslutAll: any) => {
    const currentState = useCopyTradingSwapStroeBase.getState();
    const copyTradList = reslutAll.pageData.map((item: any) => {
      const symbolList =
        item.contractInfo &&
        Object.values(JSON.parse(item.contractInfo)).map((key: any) =>
          key.includes('/usdt')
            ? key.replace('/usdt', '')
            : key.includes('-usdt')
            ? key.replace('-usdt', '')
            : key.includes('-usd', '')
            ? key.replace('-usd', '')
            : key.replace('-USDT', '')
        );
      return {
        ...item,
        symbolList: symbolList?.length > 0 && symbolList.slice(0, 3)
      };
    });
    const res2 = await Copy.fetchCopyTradeuserStatisticsList(params);
    if (res2?.code === 200) {
      const result: any = mergedArray(copyTradList, res2.data, 'uid');
      set(state => ({
        copyTradeInfo: {
          ranks: result,
          currentPage: reslutAll.currentPage,
          totalCount: reslutAll.totalCount,
          klineStatistics: res2?.data
        }
      }));
    } else {
      set(state => ({
        copyTradeInfo: {
          ranks: copyTradList,
          currentPage: reslutAll.currentPage,
          totalCount: reslutAll.totalCount,
          klineStatistics: res2?.data
        }
      }));
    }
  },
  fetchShareTrader: async (flag?: boolean) => {
    if (!Copy.isLogin()) return;
    const shareTrader = await Copy.getIsShareTrader();
    if (shareTrader?.code === 200) {
      set(state => ({ isCopyTrader: shareTrader.data.isApply === 1, isFetchCopyTrader: true }));
      if (!flag) return
      if (shareTrader.data.isApply === 1) {
        const userInfo: any = await Copy.getUserInfo();
        const detail = await Copy.fetchShareTraderDetail({
          lUid: userInfo?.uid
        });
        if (detail.code === 200) {
          set(state => ({ bringUserData: detail.data }));
        }
      }
    }
  },
  // 查询带单员详情 周期信息
  fetchTraderStatistics: async () => {
    if (!Copy.isLogin) return;
    const userInfo: any = await Copy.getUserInfo();
    const summary = await Copy.fetchCopyTradeuserStatisticsSummary({ cycle: 7, uid: userInfo?.uid });
    if (summary?.code === 200) {
      set(state => ({ traderStatistics: summary.data }));
    }
  },
  fetchContractList: async () => {
    const group = await Copy.fetchSwapTradeList();
    if (group.code === 200) {
      const filterGroup = group.data.filter(item => item.contractType === ContractType.swap);
      set(state => ({ swapCoinList: filterGroup }));
    }
  },
  // 获取交易员或跟单员详情
  getTraderDetail: async (copyUserId: string) => {
    if (copyUserId) {
      const res = await Copy.fetchShareTraderDetail({ lUid: copyUserId });
      if (res.code === 200) {
        const result = res.data;
        set(state => ({ traderDetail: result }));
      }
    }
  },
  fetchCurrentPosition: async (queryParam:any,param?: object) => {
    const currentState = useCopyTradingSwapStroeBase.getState();
    const { id, userType, copyActiveType } = queryParam;
    const params: any = {
      uid: id,
      ...param,
      subWallet: 'COPY',
      traderType: userType !== CopyTradeType.myFllow ? 1 : 2 // 1是交易员2 是跟单员
    };
   
    if (copyActiveType === CopyTradeSetting.followDetial) {
      const userInfo = await Copy.getUserInfo();
      params.uid = userInfo?.uid;
      params.lUid = id;
    }
    const res: any = await Copy.fetchSwapPositiont(params);
    if (res?.code === 200) {
      currentState.sethasAllClose(res?.data?.length > 0);
      currentState.setfetchAllClose(false);
      currentState.setPositionList(res.data);
      console.log(!param, '---setfetchAllClose')
      if (!param) {
        currentState.setNoQueryPostion(JSON.stringify(res.data));
      }
    }
  },
  setFilterInfo: (data: FILTER_INFO) => {
    set(state => ({ filterInfo: data }));
  },
  sethasAllClose: (data: boolean) => {
    set(state => ({ hasAllClose: data }));
  },
  setfetchAllClose: (data: boolean) => {
    set(state => ({ fetchAllClose: data }));
  },
  setFetchRefresh: (data: boolean) => {
    set(state => ({ isRefresh: data }));
  },
  setTabsActive: (data: string) => {
    set(state => ({ tabsActive: data }));
  },
  setSearchKey: (data: string) => {
    set(state => ({ searchKey: data }));
  },
  setUnrealisedPNLObj: (data: any) => {
    set(state => ({ unrealisedPNLObj: data }));
  },
  setMarketObj: (data: any) => {
    set(state => ({ marketObj: data }));
  },
  setNoQueryPostion: (data: any) => {
    set({ noQueryPostion: data });
  },
  setPositionList: (data: any) => {
    set({ positionList: data })
  },
  setPositionUnrealisedPNLObj: (data: any) => {
    set({ positionUnrealisedPNLObj: data })
  },
}));

export const useCopyTradingSwapStore = createSelectors(useCopyTradingSwapStroeBase);
