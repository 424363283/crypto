import { createContext } from 'react';

export const ConfigContext = createContext({
  appConfig: {},
  messages: {},
  tokens: [],
  symbols: {},
  symbolsMap: {},
} as any);
