import { StoreApi, UseBoundStore, create } from 'zustand';

type QuoteSearchStore = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

export const useQuoteSearchStore: UseBoundStore<StoreApi<QuoteSearchStore>> = create(set => ({
  searchTerm: '',
  setSearchTerm: value => set({ searchTerm: value })
}));
