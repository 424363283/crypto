import { getSpotHistoryCommissionApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { SpotTradeItem, TradeMap } from '@/core/shared';
import { message } from '@/core/utils';
import { useEffect, useMemo, useState } from 'react';
import { useImmer } from 'use-immer';
import { TableStyle } from '../../../../components/table-style';
import HistoricalTable from '../../../components/historical-table';
import { SpotFilterBar } from '../spot-filter-bar';
import { columns1 } from './column-1';
import { ORDER_HISTORY_TYPE } from '@/pages/[locale]/account/fund-management/order-history/types';
import { SPOT_HISTORY_TAB_KEY } from '../../types';
import { useResponsive } from '@/core/hooks';

export const SpotHistoryCommissionTable = () => {
  const { isMobile } = useResponsive();
  const [state, setState] = useImmer({
    page: 1,
    data: [] as any[],
    total: '0',
    loading: false,
    type: '',
    filters: {}
  });
  const { page, data, loading, total, filters } = state;
  const [spotMap, setSpotMap] = useState<Map<string, SpotTradeItem> | null>(null);

  const initSpotList = async () => {
    const map = await TradeMap.getSpotTradeMap();
    setSpotMap(map);
  };

  useEffect(() => {
    initSpotList();
  }, []);
  const formatDatalist = (resultList: any[]) => {
    if (spotMap) {
      resultList = resultList.map((item: any) => {
        const spotItem = spotMap.get(item.symbol);
        item.dealPrice = Number(item.dealPrice) > 0 ? item.dealPrice.toFixed().toFormat(spotItem?.digit) : 0;
        item.dealAmount = Number(item.dealAmount.toFixed(4));
        return item;
      });
    }
    return resultList;
  };
  const fetchSpotPosition = async ({
    symbol,
    side,
    type,
    status,
    startDate = '',
    commodity,
    endDate = ''
  }: {
    symbol: string;
    side: number;
    type: string;
    status?: number;
    commodity: string;
    startDate?: string;
    endDate?: string;
  }) => {
    setState(draft => {
      draft.loading = true;
      draft.type = type;
    });
    const params: any = {
      openTypes: '0,2',
      rows: isMobile ? 10 : 13,
      orderTimeGe: startDate,
      orderTimeLe: endDate,
    };
    if (symbol !== LANG('全部') && !!symbol) {
      params['symbol'] = symbol;
    }
    if (commodity) {
      params['commodity'] = commodity;
    }
    if (side) {
      params['side'] = side;
      params['buy'] = side === 1;
    }
    if (type !== 'all') {
      // OCO 特殊处理
      params['type'] = type === '4' ? '0' : type;
    }
    if (status) {
      params['state'] = status;
    }
    const res = await getSpotHistoryCommissionApi(params);
    if (res.code === 200) {
      setState(draft => {
        const resultList: any = res?.data?.list || [];
        draft.data = formatDatalist(resultList);
        draft.loading = false;
        draft.page = 1;
        draft.total = res?.data?.total || '0';
        draft.filters = params;
      });
    } else {
      setState(draft => {
        draft.loading = false;
      });
      message.error(res.message);
    }
  };

  const onChangePagination = async (page: number) => {
    setState(draft => {
      draft.page = page;
      draft.loading = true;
    });
    const res = await getSpotHistoryCommissionApi({ ...filters, page: page } as any);
    if (res.code === 200) {
      setState(draft => {
        draft.data = formatDatalist(res?.data?.list || []);
      });
    } else {
      message.error(res.message);
    }
    setState(draft => {
      draft.loading = false;
    });
  };

  const filterList = useMemo(() => {
    let list = data;
    list = list.filter(({ openType }: any) => openType !== 1 && openType !== 4);
    // 限价订单剔除 OCO 订单
    if (state?.type === '0') {
      list = list.filter(({ oco }: any) => !oco);
    }
    //  OCO 订单剔除限价单
    if (state?.type === '4') {
      list = list.filter(({ oco }: any) => oco);
    }
    return list;
  }, [data, state.type]);

  return (
    <>
      <SpotFilterBar onSearch={fetchSpotPosition} />
      <HistoricalTable
        dataSource={filterList}
        loading={loading}
        columns={columns1}
        showMobileTable
        showTabletTable
        isHistoryList
        historyType={SPOT_HISTORY_TAB_KEY.HISTORY_COMMISSION}
        orderType={ORDER_HISTORY_TYPE.SPOT_ORDER}
        pagination={{
          current: page,
          total: Number(total),
          pageSize: 13,
          onChange: onChangePagination
        }}
      />
      <TableStyle />
      <style jsx>
        {`
          :global(.spot_entrustError) {
            color: #ef454a;
            font-size: 12px;
            font-style: normal;
            font-weight: 500;
          }
          :global(.spot_Cancelallorders) {
            color: #717171;
            font-size: 12px;
            font-style: normal;
            font-weight: 500;
          }
          :global(.spot_ordercancellation) {
            color: #f0ba30;
            font-size: 12px;
            font-style: normal;
            font-weight: 500;
          }
          :global(.spot_success) {
            color: #07828b;
            font-size: 12px;
            font-style: normal;
            font-weight: 500;
          }
        `}
      </style>
    </>
  );
};
