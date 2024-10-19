import { StoreApi, UseBoundStore, create } from 'zustand';

// 币汇率
type IRates = {
  [key: string]: {
    [key: string]: string;
  };
};

interface RatesStore {
  rates: {};
  setRates: (rates: IRates) => void;
}
export const useRatesStore: UseBoundStore<StoreApi<RatesStore>> = create(set => ({
  rates: {},
  setRates: (rates: IRates) => set(state => ({ ...state, rates }))
}));

export function getRatesState() {
  return useRatesStore.getState();
}
