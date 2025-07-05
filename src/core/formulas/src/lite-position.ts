 import { PositionSide } from '@/core/shared/src/lite/trade/types';
 
// 简单合约持仓
export const LITE_POSITION = {
  /**
   * 根据当前价算出某一笔持仓订单的盈亏
   *
   * ① 做多：盈亏 = (当前价 - 开仓价) / 开仓价 * 杠杆 * 保证金
   *
   * ② 做空：盈亏 = (开仓价 - 当前价) / 开仓价 * 杠杆 * 保证金
   * @param type 仓位方向
   * @param price 市价
   * @param opPrice 开仓价
   * @param leverage 杠杆
   * @param margin 保证金
   */
  positionProfitAndLoss(type: PositionSide, price: number | string, opPrice: number | string, leverage: number, margin: number | string): number {
    let income = 0;
    if (type === PositionSide.LONG) {
      income = Number(price?.sub(opPrice).div(opPrice).mul(leverage).mul(margin));
    } else {
      income = Number(opPrice.sub(price).div(opPrice).mul(leverage).mul(margin));
    }
    return income;
  },
  /**
   * 根据比例计算持仓时订单的止盈价格
   *
   * ① 做多：止盈价格 = 开仓价 + (开仓价 / 杠杆 * 止盈比例)
   *
   * ② 做空：止盈价格 = 开仓价 - (开仓价 / 杠杆 * 止盈比例)
   * @param type 仓位方向
   * @param opPrice 开仓价
   * @param Frate 止盈比例
   * @param leverage 杠杆
   */
  positionCalculateProfitPrice(type: PositionSide, opPrice: number | string, Frate: number, leverage: number | string): number {
    if (type === PositionSide.LONG) {
      return Number(opPrice.add(opPrice.div(leverage).mul(Math.abs(+Frate))));
    }
    if (type === PositionSide.SHORT) {
      return Number(opPrice.sub(opPrice.div(leverage).mul(Math.abs(+Frate))));
    }
    return 0;
  },
  /**
   * 根据比例计算持仓时订单的止损价格
   *
   * ① 做多：止损价格 = 开仓价 - (开仓价 / 杠杆 * 止损比例)
   *
   * ② 做空：止损价格 = 开仓价 + (开仓价 / 杠杆 * 止损比例)
   * @param type 仓位方向
   * @param opPrice 开仓价
   * @param Lrate 止损比例
   * @param leverage 杠杆
   */
  positionCalculateStopPrice(type: PositionSide, opPrice: number | string, Lrate: number, leverage: number | string): number {
    if (type === PositionSide.LONG) {
      return Number(opPrice.sub(opPrice.div(leverage).mul(Math.abs(+Lrate))));
    }
    if (type === PositionSide.SHORT) {
      return Number(opPrice.add(opPrice.div(leverage).mul(Math.abs(+Lrate))));
    }
    return 0;
  },
  /**
   * 根据止盈价计算持仓时订单的止盈比例
   *
   * ① 做多：止盈比例 = （止盈价 - 开仓价）/（开仓价 / 杠杆）
   *
   * ② 做空：止盈比例 = -（止盈价 - 开仓价）/（开仓价 / 杠杆）
   * @param type 仓位方向
   * @param Fprice 止盈价
   * @param opPrice 开仓价
   * @param leverage 杠杆
   */
  positionCalculateFRateByFPrice(type: PositionSide, Fprice: number | string, opPrice: number | string, leverage: number | string): number {
    if (type === PositionSide.LONG) {
      return Number(Fprice.sub(opPrice).div(opPrice.div(leverage)));
    }
    if (type === PositionSide.SHORT) {
      return -Number(Fprice.sub(opPrice).div(opPrice.div(leverage)));
    }
    return 0;
  },
  /**
   * 根据止损价计算持仓时订单的止损比例
   *
   * ① 做多：止损比例 = -（开仓价 - 止损价）/（开仓价 / 杠杆）
   *
   * ② 做空：止损比例 = （开仓价 - 止损价）/（开仓价 / 杠杆）
   * @param type 仓位方向
   * @param Lprice 止损价
   * @param opPrice 开仓价
   * @param leverage 杠杆
   */
  positionCalculateLRateByLPrice(type: PositionSide, Lprice: number | string, opPrice: number | string, leverage: number | string): number {
    if (type === PositionSide.LONG) {
      return -Number(opPrice.sub(Lprice).div(opPrice.div(leverage)));
    }
    if (type === PositionSide.SHORT) {
      return Number(opPrice.sub(Lprice).div(opPrice.div(leverage)));
    }
    return 0;
  },

  /**
   * 根据保证金计算杠杆
   *
   * 杠杆 = 仓位 * 开仓价 / 保证金
   * @param volume 仓位
   * @param opPrice 开仓价
   * @param margin 保证金
   */
  positionCalculateLeverByMargin(volume: number, opPrice: number, margin: number): number {
    return Number(volume.mul(opPrice).div(margin).toFixed(2));
  },
};
