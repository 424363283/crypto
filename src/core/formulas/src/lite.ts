import { PositionSide } from '@/core/shared/src/lite/trade/types';
// 简单合约
export const LITE = {
  /**
   * 最大保证金计算 = 杠杆可开数量 / 杠杆
   * @param amountRange 开仓量范围
   * @param leverRange 杠杆范围
   * @param lever 杠杆
   */
  maxMargin: (amountRange: number[], leverRange: number[], leverage: number | string) => {
    let index = 0;
    const len = leverRange.length;
    leverRange.forEach((item, key) => {
      if (item === +leverage) return (index = key);
      if (item < +leverage) return (index = +key.add(1));
    });
    if (index > len - 1) index = len - 1;
    const amount = amountRange[index];
    return Math.trunc(+amount?.div(+leverage));
  },
  /**
   * 计算手续费 = 保证金 * 杠杆 * 手续费计算因子
   */
  fee: (margin: number | string, leverage: number | string, feex: number | string) => margin.mul(leverage).mul(feex),
  /**
   * 计算仓位 = 保证金 * 杠杆 / 价格
   */
  position: (margin: number | string, price: number | string, leverage: number) => margin.mul(leverage).div(price),
  /**
   * 体验金 保证金&手续费 推算
   * 保证金 = 1 / (杠杆 * 手续费计算因子 + 1)
   * 手续费 = 传入保证金 - 计算保证金
   * @param margin 保证金
   * @param leverage 杠杆
   * @param maxMargin 最大保证金
   * @param feex 手续费计算因子
   */
  marginAndFee: (margin: number | string, leverage: number | string, feex: number | string) => {
    const _margin = margin.mul(leverage).mul(feex).add(1);
    return {
      margin: _margin.toFixed(2),
      fee: margin.sub(_margin).toFixed(2),
    };
  },
  /**
   * 根据止盈止损比例计算止盈止损价格区间
   * @param price 价格，开仓价
   * @param leverage 杠杆
   * @param stopLossRange 止损比例区间
   * @param stopProfitRange 止盈比例区间
   */
  tradeStopLossAndStopProfitPriceRange: (
    type: PositionSide,
    price: number | string,
    leverage: number | string,
    stopLossRange: number[],
    stopProfitRange: number[]
  ): {
    LminPrice: number | string;
    LmaxPrice: number | string;
    FminPrice: number | string;
    FmaxPrice: number | string;
  } => {
    const L = stopLossRange;
    const F = stopProfitRange;
    const [Lmin, Lmax] = [L[0], L[L.length - 1]];
    const [Fmin, Fmax] = [F[0], F[F.length - 1]];
    if (type === PositionSide.LONG) {
      return {
        // 止损的最小价格 = 价格 - （价格 / 杠杆 * 止损比例）
        LminPrice: price.sub(price.div(leverage).mul(Math.abs(Lmin))),
        // 止损的最大价格 = 价格 - （价格 / 杠杆 * 止损比例）
        LmaxPrice: price.sub(price.div(leverage).mul(Math.abs(Lmax))),
        // 止盈的最小价格 = 价格 + （价格 / 杠杆 * 止盈比例）
        FminPrice: price.add(price.div(leverage).mul(Math.abs(Fmin))),
        // 止盈的最大价格 = 价格 + （价格 / 杠杆 * 止盈比例）
        FmaxPrice: price.add(price.div(leverage).mul(Math.abs(Fmax))),
      };
    }
    if (type === PositionSide.SHORT) {
      return {
        // 止损的最小价格 = 价格 + （价格 / 杠杆 * 止损比例）
        LminPrice: price.add(price.div(leverage).mul(Math.abs(Lmin))),
        // 止损的最大价格 = 价格 + （价格 / 杠杆 * 止损比例）
        LmaxPrice: price.add(price.div(leverage).mul(Math.abs(Lmax))),
        // 止盈的最小价格 = 价格 - （价格 / 杠杆 * 止盈比例）
        FminPrice: price.sub(price.div(leverage).mul(Math.abs(Fmin))),
        // 止盈的最大价格 = 价格 - （价格 / 杠杆 * 止盈比例）
        FmaxPrice: price.sub(price.div(leverage).mul(Math.abs(Fmax))),
      };
    }
    return { LminPrice: 0, LmaxPrice: 0, FminPrice: 0, FmaxPrice: 0 };
  },

  /**
   * 根据价格计算止盈止损比例
   * @param type 仓位方向
   * @param price 输入价
   * @param lastPrice 最新价
   * @param leverage 杠杆
   */
  tradeStopLossAndStopProfitRate(
    type: PositionSide,
    price: number | string,
    lastPrice: number | string,
    leverage: number | string
  ): {
    Lrate: number | string;
    Frate: number | string;
  } {
    const den = lastPrice.div(leverage); // 分母
    if (type === PositionSide.LONG) {
      return {
        Lrate: lastPrice.sub(price).div(den),
        Frate: price.sub(lastPrice).div(den),
      };
    }
    if (type === PositionSide.SHORT) {
      return {
        Lrate: price.sub(lastPrice).div(den),
        Frate: lastPrice.sub(price).div(den),
      };
    }
    return { Lrate: 0, Frate: 0 };
  },
  /**
   * 根据比例计算止盈止损价格
   * @param type 仓位方向
   * @param price 输入价
   * @param rate 比例
   * @param leverage 杠杆
   */
  tradeStopLossAndStopProfitPrice(
    type: PositionSide,
    price: number | string,
    Lrate: number | string,
    Frate: number | string,
    leverage: number | string
  ): {
    Lprice: number | string;
    Fprice: number | string;
  } {
    if (type === PositionSide.LONG) {
      return {
        Lprice: price.sub(price.div(leverage).mul(Math.abs(+Lrate))),
        Fprice: price.add(price.div(leverage).mul(Math.abs(+Frate))),
      };
    }
    if (type === PositionSide.SHORT) {
      return {
        Lprice: price.add(price.div(leverage).mul(Math.abs(+Lrate))),
        Fprice: price.sub(price.div(leverage).mul(Math.abs(+Frate))),
      };
    }
    return { Lprice: 0, Fprice: 0 };
  },
  /**
   * 预计收益保证金
   */
  tradeExpectProfitMargin: (margin: number | string, Lrate: number, Frate: number) => {
    return {
      Lmargin: margin.mul(Lrate),
      Fmargin: margin.mul(Frate),
    };
  },
  /**
   * 设置体验金计算公式
   * @param  margin 保证金
   * @param  lever 杠杆
   */
  tradeExperienceFormula(
    margin: number | string,
    lever: number | string,
    feex: number | string
  ): {
    margin: string;
    fee: string;
  } {
    // 保证金 = 1 / (杠杆 * 费率 + 1)
    const _margin = margin.div(lever.mul(feex).add(1)).toFixed(2);
    const _fee = _margin.mul(lever).mul(feex) + '';
    return {
      margin: _margin,
      fee: _fee,
    };
  },
};
