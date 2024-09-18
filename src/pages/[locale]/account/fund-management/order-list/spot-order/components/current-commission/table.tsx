import { getSpotPositionApi } from '@/core/api';
import { message } from '@/core/utils';
import { useImmer } from 'use-immer';
import { TableStyle } from '../../../../components/table-style';
import HistoricalTable from '../../../components/historical-table';
import { SpotFilterBar } from '../spot-filter-bar';
import { columns0 } from './column-0';

export const SpotCurrentCommissionTable = () => {
  const [state, setState] = useImmer({
    page: 1,
    data: [] as any,
    loading: false,
    searchParam: {} as any,
  });
  const { page, data, loading, searchParam } = state;
  const fetchSpotPosition = async ({
    symbol,
    side,
    type,
    commodity,
    page = 1,
  }: {
    commodity: string;
    symbol: string;
    side: number;
    type: string;
    page?: number;
  }) => {
    setState((draft) => {
      draft.loading = true;
      draft.page = page;
      draft.searchParam = {
        symbol,
        side,
        type,
        commodity,
        page,
      };
    });
    const params: any = {
      orderTypes: '0,2',
      rows: 13,
      page,
    };
    if (commodity) {
      params['commodity'] = commodity;
    }
    if (symbol) {
      params['symbol'] = symbol;
    }
    if (side) {
      params['side'] = side;
      params['buy'] = side === 1;
    }
    if (type !== 'all') {
      params['type'] = type;
    }
    const res = await getSpotPositionApi(params);
    if (res.code === 200) {
      setState((draft) => {
        draft.data = res.data;
      });
    } else {
      message.error(res.message);
    }
    setState((draft) => {
      draft.loading = false;
    });
  };

  const onChangePagination = (pagi: number) => {
    fetchSpotPosition({ ...searchParam, page: pagi });
  };
  return (
    <>
      <SpotFilterBar onSearch={fetchSpotPosition} />
      <HistoricalTable
        dataSource={data.filter(({ openType }: any) => openType !== 1 && openType !== 4)} // 隐藏网格委托单
        loading={loading}
        columns={columns0}
        showTabletTable
        showMobileTable
        pagination={{
          current: page,
          pageSize: 13,
          onChange: onChangePagination,
        }}
      />
      <TableStyle />
    </>
  );
};
