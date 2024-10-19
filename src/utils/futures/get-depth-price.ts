import { DEPTH, EXCHANGE_ID } from '@/constants';
import { operator } from '@/service';
import { getFutureSymbolInfo } from '.';

export function getDepthPriceData(
  /** BTC-SWAP-USDT */
  symbolId: string
): { buy: any[], sell: any[] } {
  const symbolInfo = getFutureSymbolInfo(symbolId);
  const aggTrade_digits = DEPTH[symbolInfo.minPricePrecision];
  const merged_depth = operator.getData('mergedDepth_source');
  const aggTrade_data = merged_depth[EXCHANGE_ID + '.' + symbolId + aggTrade_digits] || { a: [], b: [] };
  const sell = aggTrade_data.a || [];
  const buy = aggTrade_data.b || [];
  return { buy, sell };
}