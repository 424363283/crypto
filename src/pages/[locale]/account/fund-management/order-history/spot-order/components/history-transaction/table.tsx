import { getSpotHistoryDetailApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { message } from '@/core/utils';
import { useImmer } from 'use-immer';
import { TableStyle } from '../../../../components/table-style';
import HistoricalTable from '../../../components/historical-table';
import { SpotFilterBar } from '../spot-filter-bar';
import { column3 } from './column-2';

export const SpotHistoryTransactionTable = () => {
  const [state, setState] = useImmer({
    page: 1,
    data: [],
    total: '0',
    loading: false,
    filters: {},
  });
  const { page, data, loading, total, filters } = state;
  const fetchSpotPosition = async ({
    symbol,
    side,
    type,
    commodity = '',
    startDate = '',
    endDate = '',
  }: {
    symbol: string;
    side: number;
    commodity: string;
    type: string;
    startDate?: string;
    endDate?: string;
  }) => {
    setState((draft) => {
      draft.loading = true;
    });
    const params: any = {
      openTypes: '0,2',
      rows: 13,
      createTimeGe: startDate,
      createTimeLe: endDate,
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
    const res = await getSpotHistoryDetailApi(params);

    if (res.code === 200) {
      setState((draft) => {
        draft.data = res.data.list;
        draft.loading = false;
        draft.page = 1;
        draft.total = res?.data?.total || '0';
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
    const res = await getSpotHistoryDetailApi({ ...filters, page: page } as any);
    if (res.code === 200) {
      setState((draft) => {
        draft.data = res?.data?.list || [];
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
      <SpotFilterBar onSearch={fetchSpotPosition} />
      <HistoricalTable
        dataSource={data}
        showMobileTable
        loading={loading}
        columns={column3}
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
