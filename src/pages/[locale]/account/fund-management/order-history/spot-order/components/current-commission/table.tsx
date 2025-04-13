import { getSpotPositionApi } from '@/core/api';
import { Polling, message } from '@/core/utils';
import { useCallback, useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';
import { TableStyle } from '../../../../components/table-style';
import HistoricalTable from '../../../components/historical-table';
import { SpotFilterBar } from '../spot-filter-bar';
import { columns0 } from './column-0';
import { Loading } from '@/components/loading';
import { LoadingType, Spot } from '@/core/shared';
import { closeSpotOrderApi, getSpotPositionListApi } from '@/core/api';
import { LANG } from '@/core/i18n';

export const SpotCurrentCommissionTable = () => {
  const [state, setState] = useImmer({
    page: 1,
    data: [] as any,
    loading: false,
    isOCO: false,
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
      // OCO 特殊处理
      params['type'] = type === '4' ? '0' : type;
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

  const onChangePagination = (page: number) => {
    setState((draft) => {
      draft.page = page;
    });
    fetchSpotPosition({ ...searchParam, page: page });
  };

  const filterList = useMemo(() => {
    let list = data;
    list = list.filter(({ openType }: any) => openType !== 1 && openType !== 4);
    // 限价订单剔除 OCO 订单
    if (state?.searchParam?.type === '0') {
      list = list.filter(({ oco }: any) => !oco);
    }
    //  OCO 订单剔除限价单
    if (state?.searchParam?.type === '4') {
      list = list.filter(({ oco }: any) => oco);
    }
    return list;
  }, [data, state.searchParam]);

  useEffect(() => {
    const iter = setInterval(() => {
      fetchSpotPosition({ ...searchParam, page: page })
    }, 2000);

    return () => {
      clearInterval(iter);
    };

  }, [page, searchParam])
  return (
    <>
      <SpotFilterBar onSearch={fetchSpotPosition} filterData={filterList} />
      <HistoricalTable
        dataSource={filterList}
        // loading={loading}
        loading={false}
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
