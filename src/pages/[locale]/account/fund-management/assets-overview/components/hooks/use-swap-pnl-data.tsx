import { Loading } from '@/components/loading';
import { getSwapProfitsReportsApi, getSwapUProfitsReportsApi } from '@/core/api';
import { message } from '@/core/utils';
import { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { WalletType } from '../types';

interface SwapPnlDataProps {
  startDate?: string | number;
  endDate?: string | number;
  type: WalletType;
}
export interface SwapReportPnls {
  date: number;
  loss: number; // 亏损
  pnl: number; // 单日盈亏
  profit: number; // 盈利
  totalPnl: number; // 累计盈亏
  totalPnlRate: number; //累计盈亏率
  transferAmount: number; // 净划入
}
export const useSwapPnlData = (props: SwapPnlDataProps) => {
  const { startDate = '', endDate = '', type } = props;
  const [state, setState] = useImmer({
    totalProfit: 0, //总盈利
    totalLoss: 0, // 总亏损
    reportPnls: [] as SwapReportPnls[],
    avgProfit: 0, // 平均盈利
    avgLoss: 0,
    pnlRate: 0, // 盈亏比例
    profitDay: 0, // 盈利天数
    lossDay: 0, // 亏损天数
    flatDay: 0, // 持平天数
    winRate: 0, // 胜率
  });

  // 永续盈亏汇总 可接受日期作为参数
  const getSwapPnlReports = async (params?: { start: number | string; end: number | string }) => {
    const { start, end } = params || {};
    Loading.start();
    const SWAP_PNL_REQUESTS: any = {
      [WalletType.ASSET_SWAP]: async () =>
        await getSwapProfitsReportsApi({
          beginDate: Number(start) || 0, // 时间戳
          endDate: Number(end) || 0,
        }),
      [WalletType.ASSET_SWAP_U]: async () =>
        await getSwapUProfitsReportsApi({
          beginDate: Number(start) || 0,
          endDate: Number(end) || 0,
        }),
    };
    const res = await SWAP_PNL_REQUESTS[type]();
    if (res.code === 200) {
      const { totalProfit, totalLoss, reportPnls, avgProfit, avgLoss, pnlRate, profitDay, lossDay, flatDay, winRate } =
        res.data || {};
      setState((draft) => {
        draft.totalProfit = totalProfit || 0;
        draft.totalLoss = totalLoss || 0;
        draft.reportPnls = reportPnls || [];
        draft.avgProfit = avgProfit || 0;
        draft.avgLoss = avgLoss || 0;
        draft.pnlRate = pnlRate || 0;
        draft.profitDay = profitDay || 0;
        draft.lossDay = lossDay || 0;
        draft.flatDay = flatDay || 0;
        draft.winRate = winRate || 0;
      });
    } else {
      message.error(res.message);
    }
    Loading.end();
  };

  useEffect(() => {
    if ((type === WalletType.ASSET_SWAP || type === WalletType.ASSET_SWAP_U) && !!startDate) {
      getSwapPnlReports({
        start: startDate,
        end: endDate,
      });
    }
  }, [startDate, endDate, type]);

  return {
    ...state,
    getSwapPnlReports,
  };
};
