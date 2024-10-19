// 保证金
import { getFutureLatestPrice } from '@/service';
import { getFutureSymbolInfo } from '.';
import { currencyValue, digits } from '../common';
import { getGlobalConfig } from '../config';
import { isServerSideRender } from '../validator';
import * as mathjs from 'mathjs';
import { getRatesState } from '@/store/rates';
import { DEPTH } from '@/constants';

/**
 * 保证金
 * 公式: (挂单价格*张数*合约乘数)* (1/杠杆倍数 + 用户实际taker费率*2)
 * @param {*} quantity 数量
 * @param {*} type 方向 BUY_OPEN/SELL_OPEN
 * @returns [值,法币符号,法币值,起始保证金]
 */
export function cost(options: {
  /** 张数 */
  quantity: string;
  /** 方向 */
  sideType: SideTypes;
  /** 挂单价格 */
  price: string | number;
  /** BTC-SWAP-USDT */
  symbolSwapId: string;
  /** 杠杆倍数 */
  leverage: string;
}) {
  const { sideType, symbolSwapId, leverage } = options;
  let quantity = options.quantity;
  let price = parseFloat('' + options.price);

  const result = ['--', '', '--', ''];
  if (isServerSideRender()) return result;

  const supportLanguages = getGlobalConfig('appConfig')?.supportLanguages as any;
  if (!supportLanguages?.length) return result;
  const suffix = (supportLanguages.find((item: any) => item.lang == window.localStorage.unit) || { suffix: '' }).suffix;
  result[1] = suffix;

  if (isNaN(price) || !price || isNaN(+quantity) || +quantity <= 0 || !sideType) return result;

  if (!symbolSwapId) return result;

  const symbolInfo = getFutureSymbolInfo(symbolSwapId);
  if (!symbolInfo.baseTokenFutures) return result;

  const feeConfig = symbolInfo.baseTokenFutures.feeConfig || {};
  const multiplier = 1 / +leverage + +feeConfig?.takerBuyFee * 2;
  const contractMultiplier = symbolInfo.baseTokenFutures?.contractMultiplier; // 合约乘数

  const marginPrecision = DEPTH[symbolInfo.baseTokenFutures?.marginPrecision!]; // 保证金精度
  if (+quantity > 1) quantity = String(digits(quantity));

  if (sideType == 'SELL') {
    price = Math.max(+price, getFutureLatestPrice(symbolSwapId) || 0);
  }

  const v = mathjs
    .chain(mathjs.bignumber(multiplier))
    .multiply(mathjs.bignumber(contractMultiplier))
    .multiply(mathjs.bignumber(price))
    .multiply(mathjs.bignumber(quantity))
    .format({ notation: 'fixed' })
    .done();

  const value = digits(v, marginPrecision);
  const values = currencyValue(getRatesState().rates, +value, symbolInfo.quoteTokenId!, window.localStorage.unit, true);

  return [value, values[2], values[1], value];
}
