import React from 'react';

export const MobileTradeViewContext = React.createContext<{
  isBuy: boolean;
}>({ isBuy: false });
export const useMobileTradeViewContext = () => {
  return React.useContext(MobileTradeViewContext);
};
