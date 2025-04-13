import { Loading } from '@/components/loading';
import {
  getDepositRecordsApi,
  getExchangeRecordsApi,
  getPaymentsRecordsApi,
  getTransferRecordApi,
  getWithdrawRecordsApi
} from '@/core/api';
import { LANG } from '@/core/i18n';
import { message } from '@/core/utils';
import dayjs from 'dayjs';
import { useImmer } from 'use-immer';
import { FUND_HISTORY_TAB_KEY } from '../../types';

export const useFetchTableData = ({
  type,
  startDate,
  endDate
}: {
  type: FUND_HISTORY_TAB_KEY;
  startDate: string;
  endDate: string;
}) => {
  const [state, setState] = useImmer({
    total: 0,
    tableData: [] as any[],
    listPage: 1,
    selectedTime: { label: LANG('最近7天'), value: 7 },
    selectedCoinIndex: 0,
    searchParam: {} as any
  });
  const { total, tableData, listPage } = state;
  // 法币查询/充币记录查询
  const fetchFiatHistory = async ({ coin = 'all', page = 1 }) => {
    Loading.start();
    const params: any = {
      createTimeGe: startDate || '',
      createTimeLe: endDate || '',
      page
    };
    if (coin && coin !== 'all') {
      params['currency'] = coin;
    } else {
      const isRechargeCoin = type !== FUND_HISTORY_TAB_KEY.FIAT_CURRENCY_RECORD;
      params['coin'] = isRechargeCoin; // true:充币 false:法币查询
    }
    const res = await getDepositRecordsApi(params);
    if (res.code === 200) {
      setState(draft => {
        draft.tableData = res.data?.list || [];
        draft.total = Number(res.data.count) || 0;
        draft.listPage = res.data?.page || 0;
      });
    } else {
      message.error(res.message);
    }
    Loading.end();
  };
  // 提币记录
  const fetchWithdrawRecords = async ({ coin = 'all', page = 1 }) => {
    //transfer -> false 提币 true 转账
    Loading.start();
    const params: any = {
      createTimeGe: startDate || '',
      createTimeLe: endDate || '',
      transfer: type === FUND_HISTORY_TAB_KEY.TRANSFER_RECORD,
      page
    };
    if (coin && coin !== 'all') {
      params['currency'] = coin;
    }
    const res = await getWithdrawRecordsApi(params);
    if (res.code === 200) {
      setState(draft => {
        draft.tableData = res.data?.list || [];
        draft.total = Number(res.data?.count) || 0;
        draft.listPage = res.data?.page || 0;
      });
    } else {
      message.error(res.message);
    }
    Loading.end();
  };

  // 转账记录
  const fetchPaymentsRecords = async ({ page = 1 }) => {
    Loading.start();
    const params = {
      startTime: dayjs(startDate).valueOf(),
      endTime: dayjs(endDate).valueOf(),
      page,
      rows: 13,
      fund: 'ASSET',
      source: 'SPOT',
      target: 'SPOT'
    };

    const res = await getPaymentsRecordsApi(params);
    if (res.code === 200) {
      setState(draft => {
        draft.tableData = res.data?.list || [];
        draft.total = Number(res.data?.count) || 0;
        draft.listPage = res.data?.page || 0;
      });
    } else {
      message.error(res.message);
    }
    Loading.end();
  };

  // 闪兑getExchangeRecords
  const fetchFlashExchangeRecords = async ({ coin = 'all', page = 1 }) => {
    Loading.start();
    const params: any = {
      createTimeGe: startDate || '',
      createTimeLe: endDate || '',
      targetCurrency: 'USDT',
      page
    };
    if (coin && coin !== 'all') {
      params['sourceCurrency'] = coin;
    }
    const res = await getExchangeRecordsApi(params);
    if (res.code === 200) {
      setState(draft => {
        draft.tableData = res.data?.list || [];
        draft.total = Number(res.data?.count) || 0;
        draft.listPage = res.data?.page || 0;
      });
    } else {
      message.error(res.message);
    }
    Loading.end();
  };
  /**
   * 划转记录
   * @param param0
   * 现货转永续：source=SPOT&target=SWAP
   * 永续转现货账户：source=SWAP&target=SPOT
   * 永续转永续：source=SWAP&target=SWAP
   */
  const fetchMoveRecordData = async ({ source = 'ALL', target = 'ALL', page = 1 }) => {
    try {
      Loading.start();
      const params: any = {
        page,
        rows: 13,
        createTimeGe: startDate || '',
        createTimeLe: endDate || ''
      };
      if (source !== 'ALL') {
        params['sourceWallet'] = source;
      }
      if (target !== 'ALL') {
        params['targetWallet'] = target;
      }
      if (source === 'FUTURE' || target === 'FUTURE') {
        params['currency'] = 'USDT';
      }
      if (source === 'DELIVERY' || target === 'DELIVERY') {
        params['currency'] = 'BTC,ETH,XRP,DOT,DOGE';
      }
      const response = await getTransferRecordApi(params);
      if (response?.code !== 200) {
        message.error(response.message);
        return;
      }
      const data = response?.data?.list || [];
      setState(draft => {
        draft.tableData = data;
        draft.total = response.data?.count || 0;
        draft.listPage = response.data?.page || 0;
      });
    } catch (err: any) {
      message.error(err.message);
    } finally {
      Loading.end();
    }
  };
  const HISTORY_DATA_ROUTE_MAP = new Map<
    FUND_HISTORY_TAB_KEY,
    (params: { coin: string; page?: number; source?: string; target?: string }) => Promise<void>
  >([
    [FUND_HISTORY_TAB_KEY.MOVE_RECORD, fetchMoveRecordData],
    [FUND_HISTORY_TAB_KEY.FIAT_CURRENCY_RECORD, fetchFiatHistory],
    [FUND_HISTORY_TAB_KEY.RECHARGE_RECORD, fetchFiatHistory],
    [FUND_HISTORY_TAB_KEY.WITHDRAW_RECORD, fetchWithdrawRecords],
    [FUND_HISTORY_TAB_KEY.TRANSFER_RECORD, fetchPaymentsRecords],
    [FUND_HISTORY_TAB_KEY.FLASH_EXCHANGE_RECORD, fetchFlashExchangeRecords]
  ]);
  const fetchRecordData = HISTORY_DATA_ROUTE_MAP.get(type);

  if (!fetchRecordData) {
    throw new Error(`Invalid type: ${type}`);
  }
  return {
    total,
    listPage,
    tableData,
    fetchRecordData
  };
};
