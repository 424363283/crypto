import { formatListData } from '@/components/order-list/components/record-list';
import { getSwapAssetsTransactionApi } from '@/core/api';
import { Account } from '@/core/shared';
import { resso } from '@/core/store';
import { message } from '@/core/utils';
import dayjs from 'dayjs';
import { useCallback, useRef } from 'react';

export const store: any = resso({
  data: [],
  page: 1,
  prevParams: { endDate: undefined, startDate: undefined },
  type: undefined,
  // status: undefined,
  code: undefined,
  loading: false,
  isEnd: false,
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

      getSwapAssetsTransactionApi(
        {
          startTime: startDate,
          endTime: endDate,
          subWallet,
          page,
          size: size || 15,
        },
        isUsdtType
      )
        .then((r) => {
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
        })
        .catch((err) => {
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
    data: formatListData(formatData(store.type, store.data), store.code, 'currency'),
    loading: store.loading,
  };
};

const formatData = (type: any, data: any[]) => {
  if (type !== undefined) {
    let types: any = [];
    if (type === 'taker_fee') {
      types = ['maker_fee', 'taker_fee'];
    } else {
      types = [type];
    }
    data = data.filter((v) => types.includes(v.type));
  }

  return data;
};
