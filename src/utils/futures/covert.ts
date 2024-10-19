import * as math from 'mathjs';
import { digits, safeCallback } from '../common';

/**
   * 张转U
   * @param {*} value 数量
   * @param {*} contractMultiplier 合约乘数
   * @param {*} unitLen 精度
   * @param {*} price 价格
   */
/** e.g 1Cont 0.001 4 35000.00 -> 35 */
export const contToUSDT = (value: any, contractMultiplier: any, unitLen: any, price: any) =>
  safeCallback(() =>
    digits(
      +math
        .chain(math.bignumber(+value))
        .multiply(!isNaN(contractMultiplier) && contractMultiplier ? +contractMultiplier : 0)
        .multiply(!isNaN(price) && price ? +price : 0)
        .format({
          notation: 'fixed'
        })
        .done(),
      unitLen
    )
  );


/**
 * 张转币
 * @param {*} value 数量
 * @param {*} contractMultiplier 合约乘数
 * @param {*} unitLen 精度
 */
/** e.g 1Cont 0.001 4-> 0.001 */
export const contToCoin = (value: any, contractMultiplier: any, unitLen: any) =>
  safeCallback(() =>
    digits(
      +math
        .chain(math.bignumber(+value))
        .multiply(contractMultiplier)
        .format({
          notation: 'fixed'
        })
        .done(),
      unitLen
    )
  );

/**
 * 币转张
 * @param {*} value 数量
 * @param {*} contractMultiplier 合约乘数
 */
/** e.g 0.001BTC 0.001 -> 1Cont */
export const coinToCont = (value: any, contractMultiplier: any) =>
  safeCallback(() =>
    digits(
      +math
        .chain(math.bignumber(+value))
        .divide(contractMultiplier)
        .format({
          notation: 'fixed'
        })
        .done(),
      0
    )
  );

/**
 * 币转U
 * @param {*} value 数量
 * @param {*} unitLen 精度
 * @param {*} price 价格
 */
/** e.g 0.001BTC 4 35000.00 -> 35U */
export const coinToUSDT = (value: any, unitLen: any, price: any) =>
  safeCallback(() =>
    digits(
      +math
        .chain(math.bignumber(+value))
        .multiply(price)
        .format({
          notation: 'fixed'
        })
        .done(),
      unitLen
    )
  );

/**
 * U转币
 * @param {*} value 数量
 * @param {*} unitLen 精度
 * @param {*} price 价格
 */
/** e.g 35U 4 35000.00 -> 0.001BTC */
export const usdtToCoin = (value: any, unitLen: any, price: any) =>
  safeCallback(() =>
    digits(
      +math
        .chain(math.bignumber(+value))
        .divide(price)
        .format({
          notation: 'fixed'
        })
        .done(),
      unitLen
    )
  );

/**
 * U转张
 * @param {*} value 数量
 * @param {*} contractMultiplier 合约乘数
 * @param {*} price 价格
 */
/** e.g 35U 0.001 35000.00 -> 1张 */
export const usdtToCont = (value: any, contractMultiplier: any, price: any) =>
  safeCallback(() =>
    digits(
      +math
        .chain(math.bignumber(+value))
        .divide(price)
        .divide(contractMultiplier)
        .format({
          notation: 'fixed'
        })
        .done(),
      0
    )
  );