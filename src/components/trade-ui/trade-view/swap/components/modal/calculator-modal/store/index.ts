import { swapGetContractRiskListApi } from '@/core/api';
import { Swap } from '@/core/shared';
import { resso } from '@/core/store';
import { useMemo } from 'react';
import { MARGIN_TYPES } from '../components/select';

export const store = resso<{
  quoteId: string;
  riskListData: {
    riskList: Record<string, any>;
    maxUserLeverageObj: Record<string, any>;
    maxUserLeverageArr: any[];
    maintenanceMarginsObj: Record<string, any>;
    maintenanceMarginsArr: any[];
  };
  marginType: string;
  isBuy: boolean;
  lever: number;
  maxLever: number;
  maxAmountError: boolean;
}>({
  quoteId: '',
  riskListData: {
    riskList: {},
    maxUserLeverageObj: {},
    maxUserLeverageArr: [],
    maintenanceMarginsObj: {},
    maintenanceMarginsArr: [],
  },
  marginType: MARGIN_TYPES.ALL,
  isBuy: true,
  lever: 1,
  maxLever: 1,
  maxAmountError: false,
});

export const useStore = () => {
  const { quoteId, lever, isBuy, marginType } = store;

  return {
    quoteId,
    isUsdtType: Swap.Info.getIsUsdtType(quoteId),
    lever,
    cryptoData: Swap.Info.getCryptoData(quoteId),
    initMargins: 1 / lever,
    isBuy,
    marginType,
  };
};
export const useRiskList = () => {
  const { isUsdtType, cryptoData } = useStore();
  const { riskListData, maxAmountError, lever, quoteId } = store;

  const getRiskList = async (code: string) => {
    let maxUserLeverageObj = {};
    let maxUserLeverageArr: any[] = [];
    let maintenanceMarginsObj = {};
    let maintenanceMarginsArr: any[] = [];
    let currentRiskList = [];
    let totalRiskList = { ...store.riskListData.riskList };
    const result = await swapGetContractRiskListApi(code);
    if (result.code != 200) return;
    currentRiskList = result.data as any[];
    totalRiskList[code] = currentRiskList;

    let riskObj = {};
    const arr = currentRiskList.map(({ maxUserLeverage, maxVolume }) => {
      (riskObj as any)[maxUserLeverage] = maxVolume;
      return maxUserLeverage;
    });
    maxUserLeverageObj = riskObj;
    maxUserLeverageArr = arr.sort((a, b) => a - b);

    let riskObj_1 = {};
    const arr_1 = currentRiskList.map(({ maintenanceMargins, maxVolume }) => {
      (riskObj_1 as any)[maxVolume] = maintenanceMargins;
      return maxVolume;
    });
    maintenanceMarginsObj = riskObj_1;
    maintenanceMarginsArr = arr_1.sort((a, b) => a - b);

    store.riskListData = {
      riskList: totalRiskList,
      maxUserLeverageObj,
      maxUserLeverageArr,
      maintenanceMarginsObj,
      maintenanceMarginsArr,
    };
  };

  const maxAmount = useMemo(() => {
    const leverArr = riskListData.maxUserLeverageArr.filter((item, index) => {
      return lever <= item;
    });
    return leverArr.length ? riskListData.maxUserLeverageObj[leverArr[0]] : 0;
  }, [lever, riskListData.maxUserLeverageArr, riskListData.maxUserLeverageObj]);

  const getMaintenanceMargins = (openPrice: any, number: any) => {
    const { contractFactor } = cryptoData;
    // vol*s/hp=价值
    let value = number.mul(contractFactor);
    value = Number(isUsdtType ? value.mul(openPrice) : value.div(openPrice));

    const valueArr = riskListData.maintenanceMarginsArr.filter((item, index) => {
      return value <= item;
    });
    return riskListData.maintenanceMarginsObj[valueArr[0]];
  };

  return {
    riskList: [],
    maxAmount,
    maxAmountError,
    setMaxAmountError: (value: boolean) => (store.maxAmountError = value),
    getRiskList,
    getMaintenanceMargins,
  };
};
