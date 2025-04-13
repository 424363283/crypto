import { getLitePlanOrdersApi } from '@/core/api';
import { message } from '@/core/utils';
import { useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';
import { TableStyle } from '../../../../components/table-style';
import HistoricalTable from '../../../components/historical-table';
import { LiteFilterBar } from '../lite-filter-bar';
import { columns0 } from './column-0';
import css from 'styled-jsx/css';
import { useLiteDeferState } from '@/core/hooks/src/use-lite-defer-state';

export const LiteCurrentCommissionTable = () => {
  const [state, setState] = useImmer({
    page: 1,
    data: [] as any,
    loading: false,
    isOCO: false,
    searchParam: {} as any,
  });
  const { page, data, loading, searchParam } = state;
  const { liteMap, showDeferStatus } = useLiteDeferState();
  const columns = [ ...columns0 ];
  if (!showDeferStatus()) {
    const index = columns.findIndex(item => item.dataIndex === 'defer');
    if (index >= 0) {
      columns.splice(index, 1);
    }
  }

  const fetchLitePosition = async ({
    code,
    side,
    type,
    page = 1,
  }: {
    code: string;
    side: number;
    type: string;
    page?: number;
  }) => {
    setState((draft) => {
      draft.loading = true;
      draft.page = page;
      draft.searchParam = {
        code,
        side,
        type,
        page,
      };
    });
    const params: any = {
      orderTypes: '0,2',
      rows: 13,
      page,
    };
    if (code) {
      params['symbol'] = code;
    }
    if (side) {
      params['side'] = side;
      params['buy'] = side === 1;
    }
    if (type !== 'all') {
      // OCO 特殊处理
      params['type'] = type === '4' ? '0' : type;
    }
    const res = await getLitePlanOrdersApi(params);
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
    fetchLitePosition({ ...searchParam, page: page });
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
      fetchLitePosition({ ...searchParam, page: page })
    }, 2000);

    return () => {
      clearInterval(iter);
    };

  }, [page, searchParam])
  return (
    <>
      <LiteFilterBar onSearch={fetchLitePosition} filterData={filterList} />
      <HistoricalTable
        dataSource={filterList}
        // loading={loading}
        loading={false}
        columns={columns}
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
