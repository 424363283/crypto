import { digits } from '../common';

import * as math from 'mathjs';

/**
 * 止盈止损-触发价格类型
 *
 *  LP 限价(INPUT)
 *
 *  MP 市价(MARKET_PRICE)
 */
export enum TPSL_PRICE_TYPES {
  /** 限价(limit price) */
  LP = 0,
  /** 市价(market price) */
  MP
}

export enum TPSL_LIMIT_PRICE_TYPES {
  MARKET = 'MARKET_PRICE',
  LIMIT = 'INPUT'
}

// 止盈止损计算类型
export enum TPSL_CALC_TYPES {
  /** 触发价 */
  USDT = 0,
  /** 盈亏额 */
  RATE,
  /** 盈亏率 */
  PNL
}

export type TpslOptions = {
  /** 输入值 */
  value: any;
  /** 张数 */
  cont: number;
  /** 当前类型(触发价/盈亏额/盈亏率) */
  type: TPSL_CALC_TYPES;
  /** 方向(做空/做多) */
  isLong: boolean;
  /** 价格 */
  price: number;
  /** 合约乘数 */
  contractMultiplier: number;
  /** 是否为止盈 */
  isTp: boolean;
  /** 价格精度 */
  minPricePrecision: number;
  /** 杠杆值 */
  leverage: number;
};

export function calcTpslValue({
  contractMultiplier,
  leverage,
  isLong,
  type,
  minPricePrecision,
  isTp,
  value,
  cont,
  price
}: TpslOptions) {
  const sideValue = isLong ? 1 : -1;
  let tmpPnl: any = '';
  let tmpTriggerPrice: any = '';
  let tmpRoi: any = '';
  value = Math.abs(value);
  if (value > 0 && cont > 0 && price > 0) {
    switch (type) {
      case TPSL_CALC_TYPES.USDT:
        /**
         * 根据价格计算盈亏额和盈亏率
         * isLong 0 做空   1 做多
         *
         * 做多：盈亏额 =（-开仓均价 + 触发价 ）* 持仓张数 * 合约乘数
         * 做空：盈亏额 =（开仓均价 - 触发价）* 持仓张数 * 合约乘数
         * ROE%=盈亏额/ (开仓价*持仓张数*合约乘数/杠杆)
         */
        tmpPnl = math
          .chain(math.bignumber(price * (isLong ? -1 : 1)))
          .add(value * sideValue)
          .multiply(cont)
          .multiply(contractMultiplier)
          .format({ notation: 'fixed' })
          .done();

        tmpRoi = digits(
          math
            .chain(math.bignumber(+tmpPnl))
            .divide(
              math
                .chain(math.bignumber(price))
                .multiply(cont)
                .multiply(math.chain(math.bignumber(contractMultiplier)).divide(leverage).done())
                .done()
            )
            .multiply(100)
            .format({ notation: 'fixed' })
            .done(),
          2
        );
        tmpTriggerPrice = digits(Number(value), minPricePrecision);
        break;
      case TPSL_CALC_TYPES.RATE:
        /**
         * 根据盈亏率计算盈亏额和价格
         * 止盈触发价（平仓价）=开仓价*（1+方向*ROE%/leverage) 做多：+1 做空：-1
         * 盈亏额 = (止盈触发价 -开仓价 ) * 持仓张数 * 合约乘数*方向 做多：+1 做空：-1
         */
        if (isTp && value < 0) value = Math.abs(value);
        else if (!isTp && value > 0) value = '-' + value;

        const tmpRate = math.chain(sideValue).multiply(value).divide(100).divide(leverage).add(1).done();

        tmpTriggerPrice = tmpTriggerPrice = digits(
          math.chain(math.bignumber(price)).multiply(math.bignumber(tmpRate)).format({ notation: 'fixed' }).done(),
          minPricePrecision
        );

        tmpPnl = math
          .chain(math.bignumber(tmpTriggerPrice))
          .subtract(price)
          .multiply(cont)
          .multiply(contractMultiplier)
          .multiply(sideValue)
          .format({ notation: 'fixed' })
          .done();

        tmpRoi = value;
        break;
      case TPSL_CALC_TYPES.PNL:
        /**
         * 根据盈亏额计算盈亏率和价格
         * 止盈触发价（平仓价）＝开仓价 +方向 * 盈亏额/（持仓张数 * 合约乘数） 做多：+1 做空：-1
         * ROE%=预计盈亏额/ (开仓价*张数*合约乘数/杠杆)
         */
        if (isTp && value < 0) value = Math.abs(value);
        else if (!isTp && value > 0) value = '-' + value;

        const suffix = math
          .chain(sideValue)
          .multiply(value)
          .divide(cont * contractMultiplier)
          .done();

        tmpTriggerPrice = digits(
          math.chain(+math.bignumber(price)).add(suffix).format({ notation: 'fixed' }).done(),
          minPricePrecision
        );

        tmpRoi = digits(
          math
            .chain(math.bignumber(value))
            .divide(
              math.chain(math.bignumber(price)).multiply(cont).multiply(contractMultiplier).divide(leverage).done()
            )
            .multiply(100)
            .format({ notation: 'fixed' })
            .done(),
          2
        );
        tmpPnl = value;
        break;
    }
  }

  return {
    triggerPrice: tmpTriggerPrice,
    pnl: tmpPnl,
    rate: tmpRoi
  };
}
