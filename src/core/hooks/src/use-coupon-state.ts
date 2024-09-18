import { Loading } from '@/components/loading';
import { getLiteRewardsAccountApi } from '@/core/api';
import { message } from '@/core/utils';
import { useEffect } from 'react';
import { useImmer } from 'use-immer';

interface CouponItem {
  amount: number;
  createTime: number;
  currency: string;
  expireTime: number;
  id: string;
  label: string | null;
  lever: number;
  state: number;
  symbols: string | null;
  couponType: string;
  uid: string;
  usedAmount: number;
  type: number;
}

export const useCouponState = () => {
  const [state, setState] = useImmer<{
    normalList: CouponItem[];
    invalidList: CouponItem[];
    usedList: CouponItem[];
  }>({
    normalList: [],
    invalidList: [],
    usedList: [],
  });

  const getCouponList = async () => {
    Loading.start();
    const res = await getLiteRewardsAccountApi();
    if (res.code === 200) {
      const data = res.data;
      const liteData = data.lite.map((item) => {
        return {
          ...item,
          couponType: 'lite',
        };
      }) as CouponItem[];
      const swapData = data.swap?.map((item: CouponItem) => {
        const status: any = {
          0: 1,
          1: 1,
          3: 2,
          2: 3,
        };
        return {
          ...item,
          state: status[item.state],
          couponType: 'swap',
        };
      });
      const couponList = liteData.concat(swapData);
      setState((draft: any) => {
        draft.normalList = couponList?.filter(({ state }) => state === 1);
        draft.usedList = couponList?.filter(({ state }) => state === 2);
        draft.invalidList = couponList?.filter(({ state }) => state === 3);
      });
    } else {
      message.error(res.message);
    }
    Loading.end();
  };
  useEffect(() => {
    getCouponList();
  }, []);
  return state;
};
export type { CouponItem };
