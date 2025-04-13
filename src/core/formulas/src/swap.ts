import { OrderBookItem } from '@/core/shared/src/trade/order-book';
import { FCR, formatNumber2Ceil } from '@/core/utils/src/format';

// 永续合约
export const SWAP = {
  coin: {
    /**
     * 币本位 币数 = (张数 * 合约乘数 / 标记价格)
     * @param {number|string} vol 张数
     * @param {number|string} contractFactor 合约乘数
     * @param {number|string} flagPrice 标记价格
     * @returns {string} 币数
     */
    coinVol: (vol: number | string, contractFactor: number | string, flagPrice: number | string): string => (Number(flagPrice) === 0 ? '0' : vol.mul(contractFactor).div(flagPrice)),
    /**
     * 币本位 张数 = (币数 * 标记价格 / 合约乘数)
     * @param {number|string} vol 币数
     * @param {number|string} contractFactor 合约乘数
     * @param {number|string} flagPrice 标记价格
     * @returns {string} 张数
     */
    pieceVol: (vol: number | string, contractFactor: number | string, flagPrice: number | string): string => vol.mul(flagPrice).div(contractFactor),
    /**
     * 最大开张数量
     * @param {number} am 账户余额
     * @param {number} lever 杠杆
     * @param {number} isBuy 是否买
     * @param {number} hp 标记价格
     * @param {number} flagPrice 标记价格
     * @param {number} crossIncome 未实现盈亏
     * @param {number} maxVolume 最大持仓
     * @param {number} buyPositionValue 多仓持仓价值
     * @param {number} buyPendingValue 多仓委托价值
     * @param {number} taker taker收续费率
     * @param {number} contractFactor 合约乘数
     * @param {number} sellPositionValue 空仓持仓价值
     * @param {number} sellPendingValue 空仓委托价值
     * @param {number} maxDelegateNum 最大委托数
     * @returns
     */
    maxVolume: (am: number, lever: number, isBuy: boolean, hp: number, flagPrice: number, crossIncome: number, maxVolume: number, buyPositionValue: number, buyPendingValue: number, taker: number, contractFactor: number, sellPositionValue: number, sellPendingValue: number, maxDelegateNum: number) => {
      const r = taker;

      let am1 = 0;
      let am2 = 0;
      let vol1 = 0;
      let vol2 = 0;
      let vol = 0;

      if (isBuy) {
        // 可用保证金1=账户余额-仓位保证金-委托保证金+开仓亏损+未实现亏损
        // 可用保证金2=（杠杆最大持仓-多仓持仓价值-多仓委托价值）/杠杆
        am1 = am + Math.min(0, am * lever * hp * (1 / hp - 1 / flagPrice)) + crossIncome;
        am2 = (maxVolume - buyPositionValue - buyPendingValue) / lever;
        // 做多VOL1=可用保证金1*开仓价格/（1/杠杆+taker收续费率*2）/合约乘数
        // 做多VOL2=可用保证金2*开仓价格/合约乘数

        vol1 = (am1 * hp) / (1 / lever + r * 2) / contractFactor;
        vol2 = (am2 * hp * lever) / contractFactor;
        vol = Math.min(vol1, vol2);
      } else {
        // 可用保证金1=账户余额-仓位保证金-委托保证金+开仓亏损+未实现亏损
        // 可用保证金2=（杠杆最大持仓-空仓持仓价值-空仓委托价值）/杠杆
        am1 = am + Math.min(0, am * lever * hp * (1 / flagPrice - 1 / hp)) + crossIncome;
        am2 = (maxVolume - sellPositionValue - sellPendingValue) / lever;
        // 做空VOL1=可用保证金1*开仓价格/（1/杠杆+taker收续费率*2）/合约乘数
        // 做空VOL2=可用保证金2*开仓价格/合约乘数
        vol1 = (am1 * hp) / (1 / lever + r * 2) / contractFactor;
        vol2 = (am2 * hp * lever) / contractFactor;
        vol = Math.min(vol1, vol2);
      }
      // console.log(isBuy, { am, am1, am2, vol1, vol2, vol, lever, isBuy, hp, flagPrice, crossIncome, maxVolume, buyPositionValue, buyPendingValue, contractFactor, sellPositionValue, sellPendingValue, maxDelegateNum });

      vol = Math.min(vol, maxDelegateNum);
      if (vol < 0) {
        vol = 0;
      }

      if (Number.isNaN(vol)) {
        vol = 0;
      } else {
        vol = Number(vol.toFixed(0));
      }

      return vol;
    },
    /**
     * 委托成本
     * @param price2 委托价格
     * @param initMargins 起始保证金率
     * @param fee 手续费
     * @param lever 杠杆
     * @param contractFactor 合约乘数
     * @param flagPrice 标记价格
     * @param next 合约数量
     * @param feeRateTaker taker收续费率
     * @param isBuy 是否买
     */
    commissionCost(price2: number, initMargins: number, lever: number, contractFactor: number, flagPrice: number, next: number, feeRateTaker: number, isBuy: boolean, positionMode: boolean) {
      const format = (num: number) => formatNumber2Ceil(num, 8);
      // 起始保证金率
      const marginRate = Math.max(initMargins, 1 / lever);
      // 委托价值 = 合约数量*合约乘数/委托价格
      const position2 = price2 === 0 ? 0 : (next * contractFactor) / price2;
      // 标记价值 = 合约数量*合约乘数/flagPrice
      const flag = (next * contractFactor) / flagPrice;
      // 预估起始保证金  =  委托价值*起始保证金率
      const estimateMargin = format(position2 * marginRate);
      // 预估手续费 = 2*委托价值*提取流动性手续费率
      const estimateFee = format((positionMode ? 1 : 2) * position2 * feeRateTaker);
      // 买 预估委托亏损 = Min（0，委托价值 - 标记价值）
      // 卖 预估委托亏损 = Min（0，标记价值 - 委托价值）
      const estimateLoss = Math.min(0, isBuy ? position2 - flag : flag - position2);
      // 委托成本 =  预估起始保证金 + 预估手续费 + abs(预估亏损)
      const margin = estimateMargin + estimateFee + format(Math.abs(estimateLoss));

      return margin;
    },
    /**
     * 保证金率
     * @param volume 数量
     * @param avgCostPrice  开仓均价
     * @param contractFactor  合约乘数
     * @param liquidationPrice 强平价格
     * @param liqFeeRate 强平手续费率
     * @param margin  保证金
     * @param MMR  维持保证金率
     * @param income  未实现盈亏
     * @param isCross  是否全仓
     * @param ACCB  可用余额
     * @param bonusAmount  奖金
     * @returns
     */
    marginRate(volume: number, avgCostPrice: number, contractFactor: number, liquidationPrice: number, liqFeeRate: number, margin: number, MMR: number, income: number, isCross: boolean, ACCB: number, bonusAmount: number) {
      // VOL*S/HP
      const formula1 = avgCostPrice ? (volume * contractFactor) / avgCostPrice : 0;
      // 全仓可用= accb- unl（前端基于标记价格实时计算）
      // 逐仓可用= margin- unl（前端基于标记价格实时计算）
      // 开平仓手续费  vol*s/hp*r(taker手续费)
      const fee1 = Number(liquidationPrice) ? ((volume * contractFactor) / liquidationPrice) * Number(liqFeeRate) : 0;
      // PM
      const PM = margin;
      //  维持保证金 = VOL*S/HP*MMR+VOL*S/LP*R
      const positionMargin = FCR(formula1 * Number(MMR)) + FCR(fee1);
      // const availableBalance = Number(availableBalances[position.symbol.toLowerCase()]?.availableBalance || 0);
      // const deficit = Math.min(0, income); // 亏损
      const deficit = income;
      // 持仓保证金率：（对应每一个交易对）
      let positionMarginRate = 0;

      if (isCross) {
        // 全仓
        // 做多：(VOL*S/HP*MMR+VOL*S/LP*R)/[ACCB+VOL*S*(1/HP-1/FP)]
        // 做空：(VOL*S/HP*MMR+VOL*S/LP*R)/[ACCB+VOL*S*(1/FP-1/HP)]
        const clac = Number(ACCB).add(bonusAmount).add(deficit);
        positionMarginRate = Number(FCR(clac)) ? FCR(positionMargin) / FCR(clac) : 0;
      } else {
        // 逐仓
        // 做多：(VOL*S/HP*MMR+VOL*S/LP*R)/PM+VOL*S(1/HP-1/FP)]
        // 做空：(VOL*S/HP*MMR+VOL*S/LP*R)/[PM+VOL*S(1/FP-1/HP)]
        positionMarginRate = PM + deficit ? FCR(positionMargin) / FCR(PM + deficit) : 0;
      } // 强平负数处理  做多 0 做空 999999

      return positionMarginRate;
    },
    /**
     * 盈亏
     * @param isBuy 是否买入
     * @param volume 数量
     * @param contractFactor 合约乘数
     * @param avgCostPrice 开仓均价
     * @param flagPrice 标记价格
     */
    income(isBuy: boolean, volume: number, contractFactor: number, avgCostPrice: number, flagPrice: number) {
      let income = 0;
      const hp1 = avgCostPrice ? Number(1).div(avgCostPrice) : 0; // 1/HP
      const fp1 = flagPrice ? Number(1).div(flagPrice) : 0; // 1/FP
      if (isBuy) {
        // 买 Vol*S*(1/HP - 1/FP)
        income = Number(volume.mul(contractFactor).mul(hp1.sub(fp1)));
      } else {
        // 卖 Vol*S*(1/FP - 1/HP)
        income = Number(volume.mul(contractFactor).mul(fp1.sub(hp1)));
      }
      return income;
    },
    /**
     * 起始仓位保证金（委托）
     * @param volume  数量
     * @param contractFactor  合约乘数
     * @param feeRateTaker  taker手续费率
     * @param avgCostPrice  开仓均价
     * @param initMargins  初始保证金率
     * @returns
     */
    IPM(volume: number, contractFactor: number, feeRateTaker: number, avgCostPrice: number, initMargins: number) {
      // Vol*S/HP/L + Vol*S*R/HP*2
      const v1 = String(volume).mul(contractFactor).div(avgCostPrice).mul(initMargins);
      const v2 = String(volume).mul(contractFactor).mul(feeRateTaker).div(avgCostPrice).mul(2);
      return FCR(v1.add(v2));
    },
    /**
     * ROE
     * @param income  未实现盈亏
     * @param ipm 起始仓位保证金
     * @returns
     */
    ROE(income: number, ipm: number) {
      const ROE = Number(income).div(ipm);
      return FCR(ROE);
    },
    /**
     * 目标价格
     * @param isBuy  是否买入
     * @param contractFactor  合约乘数
     * @param openPrice  开仓价格
     * @param initMargins  初始保证金率
     * @param roe  ROE
     * @returns
     */
    targetPrice(isBuy: boolean, contractFactor: number, openPrice: number, initMargins: number, roe: number) {
      let var1: string | number = 0;
      let price: string | number = 0;
      if (isBuy) {
        // 目标价格
        // s/(s/hp-rom/100*(s/hp*imr)
        // 合约乘数/【合约乘数/开仓价格-回报率/100*(合约乘数/开仓价格*起始保证金率)】
        let buy: string | number = contractFactor.div(openPrice);
        var1 = FCR(roe.div(100).mul(contractFactor.div(openPrice).mul(initMargins)));
        buy = FCR(buy);
        price = contractFactor.div(buy.sub(var1));
      } else {
        // s/(s/hp+rom/100*(s/hp*imr)
        // 合约乘数/(合约乘数/开仓价格+回报率/100*(合约乘数/开仓价格*起始保证金率))
        let sell: string | number = contractFactor.div(openPrice);
        sell = FCR(sell);
        var1 = FCR(roe.div(100).mul(contractFactor.div(openPrice).mul(initMargins)));
        price = contractFactor.div(sell.add(var1));
      }

      return Number(price);
    },
    /**
     * 强平价格
     * @param volume  数量
     * @param isCross  是否全仓
     * @param isBuy  是否买入
     * @param contractFactor  合约乘数
     * @param openPrice  开仓价格
     * @param lever  杠杆倍数
     * @param liqFeeRate  强平手续费率
     * @param feeRateTaker  taker手续费率
     * @param accb  账户余额
     * @param mmr  维持保证金率
     * @param bonusAmount  奖金余额
     * @param sell1Price  卖1价格
     * @returns
     */
    liquidationPrice(volume: number, isCross: boolean, isBuy: boolean, contractFactor: number, openPrice: number, lever: number, liqFeeRate: number, feeRateTaker: number, accb: number, mmr: number, bonusAmount: number, feeRateMaker: number, haveOpenFee: boolean = false, sell1Price?: number) {
      let price: string | number = 0;
      // PM = Vol*S/HP/L + Vol*S*R/HP
      const S = contractFactor;
      const R = liqFeeRate;
      const PM = formatNumber2Ceil(volume.mul(S).div(openPrice).div(lever).add(volume.mul(S).mul(feeRateTaker).div(openPrice)), 8);
      // openFee
      // Buy	Vol*S/Min(OP,SP)*R
      // Sell	Vol*S/OP*R
      const price2 = isBuy && sell1Price ? Math.min(openPrice, sell1Price) : openPrice;
      const openFee = haveOpenFee ? volume.mul(S).div(price2).mul(feeRateMaker) : 0;
      if (isCross) {
        // 全仓
        if (isBuy) {
          // 多 LP=Vol*S*(1+R)/[accb+Vol*S*(1-MMR)/HP]
          price = (volume * S * (1 + R)).div(Number(Number(accb).sub(openFee).add(bonusAmount)) + FCR((volume * S * (1 - mmr)) / openPrice));
        } else {
          // 空 LP=Vol*S*(R-1)/[accb-Vol*s*(1+MMR)/HP
          price = (volume * S * (R - 1)).div(Number(Number(accb).sub(openFee).add(bonusAmount)) - FCR((volume * S * (1 + mmr)) / openPrice));
        }
      } else {
        // 逐仓
        if (isBuy) {
          // 多 LP=Vol*S*(1+R)/[PMI+Vol*S*(1-MMR)/HP]
          price = (volume * S * (1 + R)).div(PM + FCR((volume * S * (1 - mmr)) / openPrice));
        } else {
          // 空 LP=Vol*S*(R-1)/[PMI-Vol*s*(1+MMR)/HP
          price = (volume * S * (R - 1)).div(PM - FCR((volume * S * (1 + mmr)) / openPrice));
        }
      }
      if (!isBuy && Number(price) < 0) {
        price = 0;
      } else if (isBuy && Number(price) > 999999) {
        price = 999999;
      }
      return Number(price);
    },
    /**
     * 保证金
     * @param volume  数量
     * @param contractFactor  合约乘数
     * @param openPrice  开仓价格
     * @param initMargins  初始保证金率
     * @returns
     */
    margin(volume: number, contractFactor: number, openPrice: number, initMargins: number) {
      // vol*s/hp*imr
      return volume.mul(contractFactor).div(openPrice).mul(initMargins);
    },
    /**
     * 计算器 可开
     * @param openPrice  开仓价格
     * @param maxAmount  最大可开
     * @param balance  余额
     * @param lever  杠杆倍数
     * @param contractFactor    合约乘数
     * @param basePrecision  基础精度
     * @returns
     */
    canBeOpened(openPrice: number, maxAmount: number, balance: number, lever: number, contractFactor: number, basePrecision: number) {
      // 可用 * 杠杆倍数 * 标记价格 / 合约乘数
      const value = Math.min(maxAmount, Number(balance?.mul(lever)))?.toFormat(basePrecision); //可用 = 头寸和余额取最小的
      const volume = value.mul(openPrice).div(contractFactor)?.toFormat(0);

      return { value, volume };
    },
    /**
     * 开仓均价
     * @param data  仓位数据
     * @param contractFactor  合约乘数
     * @returns
     */
    openAveragePrice(data: { number: string; price: string }[], contractFactor: number) {
      let priceNum: number | string = 0;
      let numberNum: number | string = 0;
      data.forEach((position, index) => {
        const number = position.number.mul(contractFactor).div(position.price);
        priceNum = priceNum?.add(position.number.mul(contractFactor));
        numberNum = numberNum?.add(number);
      });
      return Number(priceNum.div(numberNum));
    },
    /**
     * 可用余额
     * @param isCross  是否全仓
     * @param isTransfer  是否划转
     * @param twoWayMode  是否双向持仓模式
     * @param accb  账户余额
     * @param positionMargin  仓位保证金
     * @param frozen  冻结保证金
     * @param crossIncome  全仓收益
     * @param bonusAmount  奖金余额
     * @returns
     */
    balance(isCross: boolean, isTransfer: boolean, twoWayMode: boolean, accb: number, positionMargin: number, frozen: number, crossIncome: number, bonusAmount: number) {
      let value: string | number = 0;

      if (isCross) {
        value = Number(accb.sub(positionMargin)).sub(frozen).add(crossIncome);
      } else {
        value = Number(accb.sub(positionMargin)).sub(frozen);
      }

      if (!isTransfer) {
        if (!twoWayMode) {
          value = value.add(bonusAmount);
        }
      }
      value = Number(value);

      return value < 0 ? 0 : value;
    },
    positionROE(isCross: boolean, margin: number, currentPosition: number, contractFactor: number, flagPrice: number, lever: number, income: number) {
      // if (!isCross) {
      //   // 仓位起始保证金IPM=仓位价值/ 杠杠倍数L
      //   // 币本位仓位价值=持仓张数*面值/标记价格
      //   // U本位仓位价值=持仓张数*面值*标记价格
      //   margin = Number(Number(currentPosition).mul(contractFactor).div(flagPrice).div(lever));
      // }

      const result = Number(income && margin ? income.div(margin) : 0);

      if (Number(income) == 0 || result > 100 || result < -100) {
        return 0;
      }
      return result.mul(100);
    },
    positionRoeToPrice(contractFactor: number, volume: number, price: number, roe: number, margin: number, buy: boolean) {
      let result;
      const S = contractFactor;
      if (buy) {
        result = S.mul(volume).div(S.mul(volume).div(price).sub(roe.mul(margin)));
      } else {
        result = S.mul(volume).div(S.mul(volume).div(price).add(roe.mul(margin)));
      }
      return Number(result) < 0 ? 0 : result;
    },
    positionIncomeToPrice(contractFactor: number, volume: number, price: number, income: number, buy: boolean) {
      let result;
      const S = contractFactor;
      if (buy) {
        result = S.mul(volume).div(S.mul(volume).div(price).sub(income));
      } else {
        result = S.mul(volume).div(S.mul(volume).div(price).add(income));
      }
      return Number(result) < 0 ? 0 : result;
    },
     /**
     * 预冻结平仓手续费 vol*s/avgCostPrice*r
     * @param {number} avgCostPrice
     * @param {number} currentPosition
     * @param {number} contractFactor
     * @param {number} r
     * @returns {number}
     */
     calculateFreezeClosingFee(avgCostPrice: number, currentPosition: number, contractFactor: number, r: number) {
      return Number(currentPosition).mul(contractFactor).div(avgCostPrice).mul(r);
    },
  },
  /********************
   ********************
   ******* U本位 *******
   ********************
   ********************/
  usdt: {
    /**
     * U本位-币数 = (张数 * 合约乘数)
     * @param {number|string} vol 张数
     * @param {number|string} contractFactor 合约乘数
     * @returns {string} 币数
     */
    coinVol: (vol: number | string, contractFactor: number | string): string => vol.mul(contractFactor),
    /**
     * U本位-USDT币数 = (张数 * 合约乘数 * 标记价格)
     * @param {number|string} vol 张数
     * @param {number|string} contractFactor 合约乘数
     * @param {number|string} flagPrice 标记价格
     * @returns {string} USDT币数
     */
    usdtCoinVol: (vol: number | string, contractFactor: number | string, flagPrice: number | string): string => vol.mul(contractFactor).mul(flagPrice),
    /**
     * U本位 张数(公式1) = (币数  / 合约乘数)
     * @param {number|string} vol 币数
     * @param {number|string} contractFactor 合约乘数
     * @param {number|string} flagPrice 标记价格
     * @returns {string} 张数
     */
    pieceVol1: (vol: number | string, contractFactor: number | string): string => vol.div(contractFactor),
    /**
     * U本位 张数(公式2) = (usdt币数 / 标记价格 / 合约乘数)
     * @param {number|string} vol usdt币数
     * @param {number|string} contractFactor 合约乘数
     * @param {number|string} flagPrice 标记价格
     * @returns {string} 张数
     */
    pieceVol2: (vol: number | string, contractFactor: number | string, flagPrice: number | string): string => vol.div(flagPrice).div(contractFactor),
    costToVol(isBuy: boolean, isLimit: boolean, inputPrice: number, buy1Price: number, sell1Price: number, value: number, lever: number, contractFactor: number, feeRateTaker: number, flagPrice: number) {
      const S = contractFactor; // 合约乘数
      const currentPrice = isBuy ? sell1Price : buy1Price;
      const price = isLimit ? inputPrice : currentPrice;
      let vol = '0';
      const vol1 = Number(value).mul(lever).div(price).div(S);
      const fee = Number(vol1).mul(S).mul(price).mul(feeRateTaker).mul(2);
      // 下单张数1=(输入成本*杠杆倍数)/委托价格/面值（计算出的币数量，取最小面值的整数倍，如计算结果为0.0028567，BTC面值0.001，取0.002即可）
      // 开平仓手续费=下单张数1*面值*委托价格*taker手续费率*2
      if (isBuy) {
        // 做多预估开仓亏损=(标记价格-委托价格)*下单张数1*面值]
        const fee2 = Number(flagPrice).sub(price).mul(vol1).mul(S);
        // 做多下单张数=做多最大可开币数量=[输入成本-开平仓手续费+min(0,预估做多开仓亏损)*杠杆倍数/委托价格/面值
        vol = Number(value)
          .sub(fee)
          .add(Math.min(0, Number(fee2)))
          .mul(lever)
          .div(price)
          .div(S);
      } else {
        // 做空预估开仓亏损=(委托价格-标记价格)*下单张数1*面值]
        const fee2 = Number(price).sub(flagPrice).mul(vol1).mul(S);
        // 做空下单张数=做空最大可开币数量=[输入成本-开平仓手续费+min(0,预估做空开仓亏损)*杠杆倍数/委托价格/面值
        vol = Number(value)
          .sub(fee)
          .add(Math.min(0, Number(fee2)))
          .mul(lever)
          .div(price)
          .div(S);
      }
      return Number(vol);
    },
    /**
     * 最大开张数量
     * @param {number} am 账户余额
     * @param {number} lever 杠杆
     * @param {number} isBuy 是否买
     * @param {number} hp 标记价格
     * @param {number} flagPrice 标记价格
     * @param {number} crossIncome 未实现盈亏
     * @param {number} maxVolume 最大持仓
     * @param {number} buyPositionValue 多仓持仓价值
     * @param {number} buyPendingValue 多仓委托价值
     * @param {number} taker taker收续费率
     * @param {number} contractFactor 合约乘数
     * @param {number} sellPositionValue 空仓持仓价值
     * @param {number} sellPendingValue 空仓委托价值
     * @param {number} maxDelegateNum 最大委托数
     * @param {number} buy1Price 买1价
     * @returns
     */
    maxVolume: (am: number, lever: number, isBuy: boolean, hp: number, flagPrice: number, crossIncome: number, maxVolume: number, buyPositionValue: number, buyPendingValue: number, taker: number, contractFactor: number, sellPositionValue: number, sellPendingValue: number, maxDelegateNum: number, buy1Price: number) => {
      const r = taker;

      let am1 = 0;
      let am2 = 0;
      let vol1 = 0;
      let vol2 = 0;
      let vol = 0;

      // s 合约乘数 contractFactor
      // r take手续费
      // hp 限价=输入价格 市价=买卖1价
      // 0.0006
      // const imr = Math.max(1 / lever, initMargins);

      if (isBuy) {
        // AM=AccB-IPM-OM，注：这里的IPM与OM为所有交易对的IPM和OM之和
        // AM1=AM+min[0,AM*L/OP*(FP-OP)]+min(0,UNL）,注：OP为委托价格
        // AM2=(杠杆最大持仓-多仓持仓价值-多仓委托价值)/L
        // 做多VOL1=(AM1-AM1*L*R*2)*L/OP
        // 做多VOL2=AM2*L/OP
        // 做多VOL3=min(VOL1，VOL2)
        // ***最终可开VOL=min（VOL3，合约单笔最大下单张数*合约面值）
        am1 = am + Math.min(0, ((am * lever) / hp) * (flagPrice - hp)) + crossIncome;
        am2 = (maxVolume - buyPositionValue - buyPendingValue) / lever;
        vol1 = ((am1 - am1 * lever * r * 2) * lever) / hp;
        vol2 = (am2 * lever) / hp;
        vol = Math.min(vol1, vol2);
      } else {
        // AM=AccB-IPM-OM，，注：这里的IPM与OM为所有交易对的IPM和OM之和
        // AM1=AM+min[0,AM*L/OP*( MIN(OP , BP)-FP ) ]+min(0,UNL)，注：OP为委托价格
        // AM2=(杠杆最大持仓-空仓持仓价值-空仓委托价值)/L
        // 做空VOL1=(AM1-AM1*L*R*2)*L/OP
        // 做空VOL2=AM2*L/OP
        // 做空VOL3=min(VOL1，VOL2)
        // ***做空最大可开VOL=min（VOL3，合约单笔最大下单张数*合约面值）
        //  MIN(OP , BP)
        const price1 = buy1Price ? Math.min(hp, buy1Price) : hp;
        am1 = am + Math.min(0, ((am * lever) / hp) * (price1 - flagPrice)) + crossIncome;
        am2 = (maxVolume - sellPositionValue - sellPendingValue) / lever;
        vol1 = ((am1 - am1 * lever * r * 2) * lever) / hp;
        vol2 = (am2 * lever) / hp;
        vol = Math.min(vol1, vol2);
      }

      // console.log({ am, am1, am2, vol1, vol2, vol, lever, isBuy, hp, flagPrice, crossIncome, maxVolume, buyPositionValue, buyPendingValue, contractFactor, sellPositionValue, sellPendingValue, maxDelegateNum, buy1Price });
      vol = Math.min(Number(vol.div(contractFactor)), maxDelegateNum);

      if (vol < 0) {
        vol = 0;
      }
      if (Number.isNaN(vol)) {
        vol = 0;
      } else {
        vol = Number(vol.toFixed(0));
      }

      return vol;
    },
    /**
     * 委托成本
     * @param price2 委托价格
     * @param initMargins 起始保证金率
     * @param fee 手续费
     * @param lever 杠杆
     * @param contractFactor 合约乘数
     * @param flagPrice 标记价格
     * @param next 合约数量
     * @param feeRateTaker taker收续费率
     * @param isBuy 是否买
     */
    commissionCost(price2: number, lever: number, contractFactor: number, flagPrice: number, next: number, feeRateTaker: number, isBuy: boolean, positionMode: boolean) {
      const format = (num: number | string) => formatNumber2Ceil(num, 8);

      // 委托价值 = 合约数量*合约乘数*委托价格
      // Vol*S*Min(OP,SP)
      // Buy	Vol*S*OP
      // Sell	Vol*S*Max(OP,BP)
      const position2 = price2 === 0 ? 0 : next.mul(contractFactor).mul(price2);
      // 标记价值 = 合约数量*合约乘数*flagPrice
      const flag = next.mul(contractFactor).mul(flagPrice);
      // 预估起始保证金 EIM
      // Buy	Vol*S*OP/L
      // Sell	Vol*S*Max(OP,BP) / L
      const estimateMargin = format(position2.div(lever));
      // 预估手续费 EF
      // Buy	2*Vol*S*OP*R
      // Sell	2*Vol*S*Max(OP,BP)*R
      const estimateFee = format((positionMode ? 1 : 2).mul(position2).mul(feeRateTaker));
      // 预估委托亏损  EL
      //	Buy	Min（0，Vol*S*(FP -OP))
      // 	Sell	Min { 0，Vol*S*[ ( Min(OP,BP) - FP ] }
      const estimateLoss = Math.min(0, Number(isBuy ? Number(flag).sub(position2) : position2.sub(flag)));
      // 委托成本 =  预估起始保证金 + 预估手续费 + abs(预估亏损)
      // EIM + EF + abs(EL)
      const margin = estimateMargin + estimateFee + format(Math.abs(estimateLoss));
      return margin;
    },
    /**
     * 保证金率
     * @param volume 数量
     * @param avgCostPrice  开仓均价
     * @param contractFactor  合约乘数
     * @param liquidationPrice 强平价格
     * @param liqFeeRate 强平手续费率
     * @param margin  保证金
     * @param MMR  维持保证金率
     * @param income  未实现盈亏
     * @param isCross  是否全仓
     * @param ACCB  可用余额
     * @param bonusAmount  奖金
     * @returns
     */
    marginRate(volume: number, avgCostPrice: number, contractFactor: number, liquidationPrice: number, liqFeeRate: number, margin: number, MMR: number, income: number, isCross: boolean, ACCB: number, bonusAmount: number) {
      const formula1 = avgCostPrice ? volume * contractFactor * avgCostPrice : 0;
      // 开平仓手续费  VOL*S/LP*R
      const fee1 = liquidationPrice ? volume * contractFactor * liquidationPrice * Number(liqFeeRate) : 0;
      // if (!isBuy) {
      //   // VOL*S*LP*R
      //   fee1 = liquidationPrice ? volume * contractFactor * liquidationPrice * Number(liqFeeRate) : 0;
      // }
      // PM
      const PM = margin;
      //  维持保证金 = VOL*S*HP*MMR+VOL*S/LP*R
      const positionMargin = formula1 * Number(MMR) + fee1;
      // console.log('liquidationPrice>>> liquidationPrice ',liquidationPrice); 
      // console.log('positionMargin>>> formula1 ',formula1,' MMR ',MMR,' fee1 ',fee1); 

      // const availableBalance = Number(availableBalances[position.symbol.toLowerCase()]?.availableBalance || 0);

      // 持仓保证金率：（对应每一个交易对）
      let positionMarginRate = 0;
      if (isCross) {
        ACCB = Number(ACCB.add(bonusAmount || 0));
      }
      ACCB = Number(ACCB) < 0 ? 0 : ACCB;

      if (isCross) {

        // 全仓
        // buy：(VOL*S*HP*MMR+VOL*S*LP*R) / [AB1+PM+VOL*S*(FP-HP)]
        // sell:(VOL*S*HP*MMR+VOL*S*LP*R) / [AB1+PM+VOL*S*(HP-FP)]]
        const clac = Number(ACCB).add(PM).add(income);
        
        // console.log('marginRate>>> ACCB',ACCB,' PM',PM,' income',income,' clac=',clac); 

        positionMarginRate = clac ? FCR(positionMargin) / FCR(clac) : 0;
        // console.log('marginRate>/>> positionMargin / clac',positionMargin,' / ',clac,' = ',positionMarginRate); 
        // console.log('marginRate>>> positionMarginRate',positionMarginRate); 

      } else {
        // 逐仓
        // buy (VOL*S*HP*MMR+VOL*S*LP*R) / [PM+VOL*S*(FP-HP)]
        // sell (VOL*S*HP*MMR+VOL*S*LP*R) / [PM+VOL*S*(HP-FP)]
        positionMarginRate = PM + income ? FCR(positionMargin) / FCR(PM + income) : 0;
      }

      return positionMarginRate;
    },
    /**
     * 盈亏
     * @param isBuy 是否买入
     * @param volume 数量
     * @param contractFactor 合约乘数
     * @param avgCostPrice 开仓均价
     * @param flagPrice 标记价格
     */
    income(isBuy: boolean, volume: number, contractFactor: number, avgCostPrice: number, flagPrice: number) {
      let income: number | string = 0;
      if (flagPrice < 0) return 0;

      if (isBuy) {
        // 买 Vol*S*(FP -HP)
        income = Number(volume).mul(contractFactor).mul(flagPrice.sub(avgCostPrice));
        // console.log('盈亏计算 买 volume * contractFactor * (flagPrice - avgCostPrice)',volume,contractFactor,flagPrice,avgCostPrice,'=',income);
      } else {
        // 卖 Vol*S*(HP - FP)
        income = Number(volume).mul(contractFactor).mul(Number(avgCostPrice).sub(flagPrice));
        // console.log('盈亏计算 卖 volume * contractFactor * (avgCostPrice - flagPrice) ',volume,contractFactor,avgCostPrice,flagPrice,'=',income);

      }
     
      return Number(income);
    },
    /**
     * 起始仓位保证金（委托）
     * @param volume  数量
     * @param contractFactor  合约乘数
     * @param feeRateTaker  taker手续费率
     * @param avgCostPrice  开仓均价
     * @param initMargins  初始保证金率
     * @returns
     */
    IPM(volume: number, contractFactor: number, feeRateTaker: number, avgCostPrice: number, initMargins: number) {
      //  Vol*S*HP/L + Vol*S*HP*R*2
      const v1 = Number(volume).mul(contractFactor).mul(avgCostPrice).mul(initMargins);
      const v2 = Number(volume).mul(contractFactor).mul(avgCostPrice).mul(feeRateTaker).mul(2);

      return FCR(v1.add(v2));
    },
    /**
     * ROE
     * @param income  未实现盈亏
     * @param ipm 起始仓位保证金
     * @returns
     */
    ROE(income: number, ipm: number) {
      const ROE = Number(income).div(ipm);

      return FCR(ROE);
    },
    /**
     * 目标价格
     * @param isBuy  是否买入
     * @param contractFactor  合约乘数
     * @param openPrice  开仓价格
     * @param initMargins  初始保证金率
     * @param roe  ROE
     * @returns
     */
    targetPrice(isBuy: boolean, openPrice: number, initMargins: number, roe: number) {
      // TP	计算器-目标价格	Buy	HP*(1+ROE/100*IMR)   --这里的roe是输入框中输入的数值，IMR=1/杠杆倍数	根据盈利率ROE公式倒推目标价格
      // Sell	HP*(1-ROE/100*IMR)                   --这里的roe是输入框中输入的数值，IMR=1/杠杆倍数

      const var1 = roe.div(100).mul(initMargins); // ROE/100*IMR
      let price: string | number = 0;
      if (isBuy) {
        price = Number(openPrice).mul(Number(1).add(var1));
      } else {
        price = Number(openPrice).mul(Number(1).sub(var1));
      }

      return Number(price);
    },
    /**
     * 强平价格
     * @param volume  数量
     * @param isCross  是否全仓
     * @param isBuy  是否买入
     * @param contractFactor  合约乘数
     * @param openPrice  开仓价格
     * @param lever  杠杆倍数
     * @param liqFeeRate  强平手续费率
     * @param feeRateTaker  taker手续费率
     * @param accb  账户余额
     * @param mmr  维持保证金率
     * @param bonusAmount  奖金余额
     * @param buy1Price  买1价
     * @returns
     */
    liquidationPrice(volume: number, isCross: boolean, isBuy: boolean, contractFactor: number, openPrice: number, liqFeeRate: number, accb: number, mmr: number, bonusAmount: number, margin: number, feeRateMaker: number, haveOpenFee: boolean = false, buy1Price?: number) {
      let price: string | number = 0;
      const S = contractFactor;
      const R = liqFeeRate;

      // openFee
      // Buy	Vol*S*OP
      // Sell	Vol*S*Max(OP,BP)
      const price2 = isBuy || !buy1Price ? openPrice : Math.max(openPrice, buy1Price);
      const openFee = haveOpenFee ? Number(volume.mul(S).mul(price2).mul(feeRateMaker)) : 0;
      const accbb = accb;
      if (isCross) {
        accb = Number(accb.add(bonusAmount));
      }
      // u本位的PM就是余额 全仓AB+PM=逐仓PM
      accb = accb < 0 ? 0 : accb;
      const PM = Number(margin);

      if (isCross) {
        // 全仓
        if (isBuy) {
          // 多 LP =[AB+PM-VOL*S*HP*(1+MMR)] / [VOL*S*(R-1)]
          price = (Number(accb) - openFee + PM - volume * S * openPrice * (1 + mmr)) / (volume * S * (R - 1));
          // console.log(isBuy, { accbb, volume, S, R, accb, openFee, bonusAmount, mmr, openPrice });
        } else {
          // 空 LP =[AB+PM+VOL*S*HP*(1-MMR)] / [VOL*S*(R+1)]
          price = (Number(accb) - openFee + PM + volume * S * openPrice * (1 - mmr)) / (volume * S * (R + 1));
        }
      } else {
        // 逐仓
        if (isBuy) {
          // 多 LP =[PM-VOL*S*HP*(1+MMR)] / [VOL*S*(R-1)]
          price = (PM - volume * S * openPrice * (1 + mmr)) / (volume * S * (R - 1));
        } else {
          // 空 LP =[PM+VOL*S*HP*(1-MMR)] / [VOL*S*(R+1)]
          price = (PM + volume * S * openPrice * (1 - mmr)) / (volume * S * (R + 1));
        }
      }
      // 强平负数处理  做多 0 做空 999999
      if (isBuy && price < 0) {
        price = 0;
      } else if (!isBuy && price > 999999) {
        price = 999999;
      }
      return Number(price);
    },
    /**
     * 保证金
     * @param volume  数量
     * @param contractFactor  合约乘数
     * @param openPrice  开仓价格
     * @param initMargins  初始保证金率
     * @returns
     */
    margin(volume: number, contractFactor: number, openPrice: number, initMargins: number) {
      return volume.mul(contractFactor).mul(openPrice).mul(initMargins);
    },
    /**
     * 计算器 可开
     * @param openPrice  开仓价格
     * @param maxAmount  最大可开
     * @param balance  余额
     * @param lever  杠杆倍数
     * @param contractFactor    合约乘数
     * @param basePrecision  基础精度
     * @returns
     */
    canBeOpened(openPrice: number, maxAmount: number, balance: number, lever: number) {
      // MV	计算器-可开(币数量）	Max Volume	AM*L/OP	可用 * 杠杆倍数/输入价格
      // 	计算器-可开(张数）	Max Volume	AM*L	可用 * 杠杆倍数/输入价格/合约乘数
      const value = Math.min(maxAmount, Number(balance.mul(lever).div(openPrice))); // 可用 = 头寸和余额取最小的
      const volume = value * openPrice;
      return { value, volume };
    },
    /**
     * 开仓均价
     * @param data  仓位数据
     * @param contractFactor  合约乘数
     * @returns
     */
    openAveragePrice(data: { number: string; price: string; cryptoNumber: string }[], contractFactor: number) {
      let priceNum: number | string = 0;
      let numberNum: number | string = 0;
      data.forEach((position, index) => {
        const vol = this.pieceVol1(position.cryptoNumber, contractFactor);
        priceNum = priceNum?.add(vol.mul(contractFactor).mul(position.price));
        numberNum = numberNum?.add(position.cryptoNumber);
      });
      return Number(priceNum.div(numberNum));
    },
    /**
     * 可用余额
     * @param isCross  是否全仓
     * @param isTransfer  是否划转
     * @param twoWayMode  是否双向持仓模式
     * @param accb  账户余额
     * @param positionMargin  仓位保证金
     * @param frozen  冻结保证金
     * @param crossIncome  全仓收益
     * @param bonusAmount  奖金余额
     * @returns
     */
    balance(isCross: boolean, isTransfer: boolean, twoWayMode: boolean, accb: number, positionMargin: number, frozen: number, crossIncome: number, bonusAmount: number) {
      let value: string | number = 0;

      if (isCross) {
        value = Number(accb.sub(positionMargin)).sub(frozen).add(crossIncome);
      } else {
        value = Number(accb.sub(positionMargin)).sub(frozen);
      }

      if (!isTransfer) {
        if (!twoWayMode) {
          value = value.add(bonusAmount);
        }
      }
      value = Number(value);

      return value < 0 ? 0 : value;
    },
    positionROE(isCross: boolean, margin: number, currentPosition: number, contractFactor: number, flagPrice: number, lever: number, income: number) {
      // if (!isCross) {
      //   // 仓位起始保证金IPM=仓位价值/ 杠杠倍数L
      //   // 币本位仓位价值=持仓张数*面值/标记价格
      //   // U本位仓位价值=持仓张数*面值*标记价格
      //   margin = Number(Number(currentPosition).mul(contractFactor).mul(flagPrice).div(lever));
      // }

      const result = Number(Number(income) && Number(margin) ? income.div(margin) : 0);

      if (Number(income) == 0 || result > 100 || result < -100) {
        return 0;
      }
      return result.mul(100);
    },
    positionRoeToPrice(contractFactor: number, volume: number, price: number, roe: number, margin: number, buy: boolean) {
      let result;
      const S = contractFactor;
      if (buy) {
        result = roe.div(volume).add(price);
      } else {
        result = price.sub(roe.mul(margin).div(volume));
      }
      return Number(result) < 0 ? 0 : result;
    },
    /**
     * 预冻结平仓手续费 vol*s/avgCostPrice*r
     * @param {number} avgCostPrice
     * @param {number} currentPosition
     * @param {number} contractFactor
     * @param {number} r
     * @returns {number}
     */
    calculateFreezeClosingFee(avgCostPrice: number, currentPosition: number, contractFactor: number, r: number) {
      return Number(currentPosition).mul(contractFactor).div(avgCostPrice).mul(r);
    },
  },
  /**
   * 买卖盘合并计算公式
   * @param {boolean} isBuy 是否买盘或者卖盘
   * @param {number} group 合并数量
   * @param {OrderBookItem[]} list 买卖盘列表
   */
  orderBookConcat: (isBuy: boolean, group: number, list: OrderBookItem[]): OrderBookItem[] => {
    const _group = 1 / group;
    const _list: OrderBookItem[] = [];
    list.forEach((item) => {
      const { price, amount, priceDigit, amountDigit } = item;
      const _item: OrderBookItem = new OrderBookItem(price, amount, priceDigit, amountDigit);
      if (isBuy) {
        _item['price'] = Math.floor(+price * _group) / _group;
      } else {
        _item['price'] = Math.ceil(+price * _group) / _group;
      }
      const index = _list.findIndex((item) => +item.price === +_item.price);
      if (index === -1) {
        _list.push(_item);
      } else {
        _list[index]['amount'] = +_list[index]['amount'] + +_item.amount;
      }
    });
    return _list;
  },
};
