import { formatListData } from '@/components/order-list/components/record-list';
import { getSwapHistoryOrderApi } from '@/core/api';
import { Account } from '@/core/shared';
import { resso } from '@/core/store';
import { message } from '@/core/utils';
import dayjs from 'dayjs';
import { useCallback, useRef } from 'react';
import { ORDER_TYPES } from '../../media/desktop/components/pending-list/components/order-type-select';

export const store: any = resso({
  data: [],
  page: 1,
  prevParams: { endDate: undefined, startDate: undefined },
  type: undefined,
  status: undefined,
  code: undefined,
  loading: false,
  isEnd: false,
  orderType: ORDER_TYPES.LIMIT
});

export const useData = ({ isUsdtType, scrollToTop }: { isUsdtType: boolean; scrollToTop?: () => any }) => {
  const _ = useRef({ prevParams: {} }).current;

  const onSubmit = useCallback(
    (params = {}, more?: boolean) => {
      const statePage = store.getSnapshot('page');
      const stateLoading = store.getSnapshot('loading');
      const stateIsEnd = store.getSnapshot('isEnd');

      let page = more ? statePage + 1 : 1;

      if (!Account.isLogin || stateLoading || (more && stateIsEnd)) {
        return;
      }

      const prevParams: any = { ..._.prevParams, ...params };
      store.loading = true;
      _.prevParams = prevParams;

      let { endDate, startDate, size, subWallet } = prevParams;

      startDate = startDate ? dayjs(startDate).toDate().getTime() : undefined;
      endDate = endDate ? dayjs(endDate).toDate().getTime() : undefined;

      getSwapHistoryOrderApi(
        {
          endDate,
          beginDate: startDate,
          subWallet,
          page,
          size: size || 15,
        },
        isUsdtType
      ).then((r) => {
        if (r.code === 200) {
          const result = r.data;
          const nextPage = result.currentPage;
          const newData = [...(nextPage === 1 ? [] : store.getSnapshot('data')), ...result.pageData];

          if (nextPage === 1) {
            scrollToTop?.();
          }

          store.page = nextPage;
          store.data = newData;
          store.isEnd = newData.length === result.totalCount;
        } else {
          message.error(r);
        }
        store.loading = false;

      }).catch((err) => {
        message.error(err);
        store.loading = false;
      });
    },
    [isUsdtType, _, scrollToTop]
  );

  const onLoadMore = useCallback(() => {
    onSubmit({}, true);
  }, [onSubmit]);

  return {
    onSubmit,
    onLoadMore,
    resetParams: () => (_.prevParams = {}),
    data: formatListData(formatData(store.type, store.status, store.data), store.code),
    loading: store.loading,
  };
};

const formatData = (type: any, status: any, data: any[]) => {
  const type2 = type + '';

  if (type !== undefined) {
    data = data.filter((v) => {
      const type1 = v.type + '';
      if (type2 === '1' && v.orderType === 1) {
        return ['1', '4'].includes(type1);
      } else if (type2 === '2' && v.orderType === 1) {
        return ['2', '5'].includes(type1);
      } else if (type2 === '3') {
        return type1 === '3';
      } else if (type2 === '4' && v.orderType === 2) {
        return v.strategyType === '1';
      } else if (type2 === '5' && v.orderType === 2) {
        return v.strategyType === '2';
      } else if (type2 === '100') {
        return v.orderType === 3;
      }
      return false;
    });
  }

  if (status !== undefined) {
    data = data.filter((v) => v.status + '' === status + '');
  }
  return data;
};
