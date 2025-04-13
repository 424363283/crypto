import { getLiteHistoryApi, getLiteHistoryTransactionApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { message } from '@/core/utils';
import { useImmer } from 'use-immer';
import { TableStyle } from '../../../../components/table-style';
import HistoricalTable from '../../../components/historical-table';
import { LiteFilterBar } from '../lite-filter-bar';
import { column3 } from './column-2';

export const LiteHistoryTransactionTable = () => {
  const [state, setState] = useImmer({
    page: 1,
    data: [],
    total: '0',
    loading: false,
    filters: {},
  });
  const { page, data, loading, total, filters } = state;
  const fetchLitePosition = async ({
    code,
    side,
    type,
    startDate = '',
    endDate = '',
  }: {
    code: string;
    side: number;
    type: string;
    startDate?: string;
    endDate?: string;
  }) => {
    setState((draft) => {
      draft.loading = true;
    });
    const params: any = {
      standard: true,
      rows: 13,
      // createTimeGe: startDate,
      // createTimeLe: endDate,
    };
    if (code) {
      params['symbol'] = code;
    }
    if (side) {
      params['side'] = side;
      params['buy'] = side === 1;
    }
    if (type !== 'all') {
      params['type'] = type;
    }
    const res = await getLiteHistoryTransactionApi(params);

    if (res.code === 200) {
      setState((draft) => {
        draft.data = res.data.list;
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
    const res = await getLiteHistoryTransactionApi({ ...filters, page: page } as any);
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
      <LiteFilterBar onSearch={fetchLitePosition} />
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
