import { MarketItem } from '@/core/shared';
export const formatCoinName = (name: string) => name?.replace(/USDT|BUSD|USDC|EUR|GBP|USD/, '');

export const formatSpotCoinName = (item: MarketItem) => {
  if (item.type?.toUpperCase() === 'SPOT' || item.type?.toUpperCase() === 'ETF') {
    return item.coin + '/' + item.quoteCoin;
  }
  return item.name;
};
