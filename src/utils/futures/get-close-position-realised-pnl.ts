import { getPositionOrder } from '@/store/tradingTab/positionOrder';
import { U_Precision, getFutureSymbolInfo } from '.';
import { getFutureLatestPrice } from '@/service';
import { digits } from '../common';

/**
 * 计算预计盈亏
 *
 * 精度： 保留四位
 */
export function getClosePositionRealisedPnl(
  /** BTC-SWAP-USDT */
  symbolSwapId: string,
  /** 张数 */
  totalCont: number | string,
  /** 方向 */
  orderSide: 'BUY' | 'SELL',
  /** 如果为市价则不需要传入 */
  price?: string,
  /** 开仓均价 */
  openPrice?: string,
) {
  const contractMultiplier: any = getFutureSymbolInfo(symbolSwapId).baseTokenFutures?.contractMultiplier;
  const isLong = orderSide == 'SELL' ? 1 : 0;
  const positionList = getPositionOrder().positionList;
  const newOpenPrice: any = openPrice || positionList?.filter((item: any) => item.isLong == isLong && item.symbolId == symbolSwapId)[0]
    ?.avgPrice;
  const newPrice: any = price || getFutureLatestPrice(symbolSwapId);

  /*
   * 预计盈亏：＞0绿色，≤0红色
   * 平多：预计盈利 =（平仓价格 - 开仓均价）* 持仓张数 * 合约乘数
   * 平空：预计盈利 =（开仓均价 - 平仓价格）* 持仓张数 * 合约乘数
   */
  const subtract = orderSide == 'SELL' ? newPrice - newOpenPrice : newOpenPrice - newPrice;
  return digits(subtract * (+totalCont) * contractMultiplier, U_Precision);
}
