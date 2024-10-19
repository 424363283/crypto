import { StoreApi, UseBoundStore, create } from 'zustand';

export type OrderList = {
  orderId: number | string,
  tryCount: number
}[];

/**
 * 资金账户不足 Store
 */
interface FutureInsufficient {
  // 反手订单ID
  orders: OrderList;
  // 是否显示弹窗
  visible: boolean;
  // 设置反手订单
  setInsufficientOrders: (orders: OrderList) => void;
  // 资金不足弹窗
  setInsufficientVisible: (visible: boolean) => void;
}

export const useFutureInsufficient: UseBoundStore<StoreApi<FutureInsufficient>> = create(set => ({
  visible: false,
  orders: [],
  setInsufficientOrders: (orders: OrderList) => set(state => ({ ...state, orders })),
  setInsufficientVisible: (visible: boolean) => set(state => ({ ...state, visible })),
}));
