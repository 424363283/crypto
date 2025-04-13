import { StoreApi, UseBoundStore, create } from 'zustand';

type SymbolStore = {
    symbolStatus: number;
    togglesymbolStatus: () => void;
};

export const useSymbolStore: UseBoundStore<StoreApi<SymbolStore>> = create(set => ({
  symbolStatus: 0,
  togglesymbolStatus: () => set(state => ({ symbolStatus: state.symbolStatus? 0: 1 })),
}));


export function getSymbolStore() {
  return useSymbolStore.getState();
}