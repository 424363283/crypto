import { createContext } from 'react';
import { Lite } from './lite';
import { Spot } from './spot';
import { Swap } from './swap';

export const QuoteListContext = createContext({
  quoteListApi: { current: { clearSearchInput: () => {} } }
});
export const QuoteList = { Lite, Spot, Swap };
