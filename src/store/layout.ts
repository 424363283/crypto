import { StoreApi, UseBoundStore, create } from 'zustand';

type LayoutStore = {
    resetLayout: boolean;
    toggleResetLayout: () => void;
};

export const useLayoutStore: UseBoundStore<StoreApi<LayoutStore>> = create(set => ({
  resetLayout: false,
  toggleResetLayout: () => set(state => ({ resetLayout: !state.resetLayout })),
}));


export function getLayoutStore() {
  return useLayoutStore.getState();
}