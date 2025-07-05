import { getSpotHistoryCommissionApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { SpotTradeItem, TradeMap } from '@/core/shared';
import { message } from '@/core/utils';
import { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { TableStyle } from '../../../../components/table-style';
import HistoricalTable from '../../../components/historical-table';
import { SpotFilterBar } from '../spot-filter-bar';
import { columns1 } from './column-1';

export const SpotHistoryCommissionTable = () => {
  const [state, setState] = useImmer({
    page: 1,
    data: [] as any[],
    total: '0',
    loading: false,
    filters: {},
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
        item.dealPrice = item.dealPrice.toFormat(spotItem?.digit);
        item.dealAmount = item.dealAmount.toFormat(4);
        return item;
      });
    }
    return resultList;
  };
  const fetchSpotPosition = async ({
    symbol,
    side,
    type,
    startDate = '',
    commodity,
    endDate = '',
  }: {
    symbol: string;
    side: number;
    type: string;
    commodity: string;
    startDate?: string;
    endDate?: string;
  }) => {
    setState((draft) => {
      draft.loading = true;
    });
    const params: any = {
      openTypes: '0,2',
      rows: 13,
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
      params['type'] = type;
    }
    const res = await getSpotHistoryCommissionApi(params);
    if (res.code === 200) {
      setState((draft) => {
        const resultList: any = res?.data?.list || [];
        draft.data = formatDatalist(resultList);
        draft.loading = false;
        draft.page = 1;
        draft.total = res?.data?.count || '0';
        draft.filters = params;
      });
    } else {
      setState((draft) => {
        draft.loading = false;
      });
      message.error(res.message);
    }
  };

  const onChangePagination = async (page: number) => {
    setState((draft) => {
      draft.page = page;
      draft.loading = true;
    });
    const res = await getSpotHistoryCommissionApi({ ...filters, page: page } as any);
    if (res.code === 200) {
      setState((draft) => {
        draft.data = formatDatalist(res?.data?.list || []);
      });
    } else {
      message.error(res.message);
    }
    setState((draft) => {
      draft.loading = false;
    });
  };
  return (
    <>
      {spotMap && <SpotFilterBar onSearch={fetchSpotPosition} />}
      <HistoricalTable
        dataSource={data}
        loading={loading}
        columns={columns1}
        showMobileTable
        showTabletTable
        pagination={{
          current: page,
          total: Number(total),
          pageSize: 13,
          onChange: onChangePagination,
        }}
      />
      <TableStyle />
    </>
  );
};
