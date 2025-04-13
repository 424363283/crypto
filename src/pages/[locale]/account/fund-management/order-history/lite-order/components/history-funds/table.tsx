import { getLiteHistoryApi, getLiteHistoryFundsApi, getLiteHistoryFundsV2Api } from '@/core/api';
import { LANG } from '@/core/i18n';
import { LiteTradeItem, TradeMap } from '@/core/shared';
import { message } from '@/core/utils';
import { useEffect, useMemo, useState } from 'react';
import { useImmer } from 'use-immer';
import { TableStyle } from '../../../../components/table-style';
import HistoricalTable from '../../../components/historical-table';
import { LiteFilterBar } from '../lite-filter-bar';
import { columns1 } from './column-1';

export const LiteHistoryFundsTable = () => {
  const [state, setState] = useImmer({
    page: 1,
    data: [] as any[],
    total: '0',
    loading: false,
    type: '',
    filters: {},
  });
  const { page, data, loading, total, filters } = state;
  const fetchLitePosition = async ({
    code,
    side,
    type,
    status,
    startDate = '',
    endDate = '',
  }: {
    code: string;
    side: number;
    type: string;
    status?: number,
    startDate?: string;
    endDate?: string;
  }) => {
    setState((draft) => {
      draft.loading = true;
      draft.type = type;
    });
    const params: any = {
      size: 13,
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
      // OCO 特殊处理
      params['explains'] = [ type ];
    }
    if (status) {
      params['state'] = status;
    }
    const res = await getLiteHistoryFundsV2Api(params);
    if (res.code === 200) {
      setState((draft) => {
        draft.data = res?.data?.list;
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
    const res = await getLiteHistoryFundsV2Api({ ...filters, page: page } as any);
    if (res.code === 200) {
      setState((draft) => {
        draft.data = res?.data?.list;
      });
    } else {
      message.error(res.message);
    }
    setState((draft) => {
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
      {<LiteFilterBar onSearch={fetchLitePosition} />}
      <HistoricalTable
        dataSource={filterList}
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
      <style jsx>{`
        :global(.lite_entrustError) {
          color: #ef454a;
          font-size: 12px;
          font-style: normal;
          font-weight: 500;
        }
        :global(.lite_Cancelallorders) {
          color: #717171;
          font-size: 12px;
          font-style: normal;
          font-weight: 500;
        }
        :global(.lite_ordercancellation) {
          color: #f0ba30;
          font-size: 12px;
          font-style: normal;
          font-weight: 500;
        }
        :global(.lite_success) {
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
