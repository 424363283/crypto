import { infoInstance as Info } from '../info';
import { socketInstance as Socket } from '../socket';

export const getFlagPrice = (code: string, defaultPrice?: number | null) => {
  if (![undefined, null].includes(defaultPrice as any)) return defaultPrice || 0;
  const currentPrice = Socket.getFlagPrice(code, { withHooks: false }); // 当前推送的标记价格

  return currentPrice;
};

export const getCryptoData = (code: string) => {
  return Info.getCryptoData(code.toUpperCase(), { withHooks: false });
};
export const getIsVolUnit = (usdt: boolean) => {
  return Info.getIsVolUnit(usdt, { withHooks: false });
};
