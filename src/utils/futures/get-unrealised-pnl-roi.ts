import { digits } from '../common';
import Big from 'big.js';

type POSITION_SHORT = 0; // 空
type POSITION_LONG = 1; // 多

type UnRealizedOptions = {
  /* 价格 */
  price: number;
  /* 均价 */
  avgPrice: number;
  /* 仓位数量-张 */
  contAmount: number;
  /* 合约乘数 */
  contractMultiplier: number;
  /* 持仓方向 */
  positionSide: POSITION_SHORT | POSITION_LONG;
  /* 保证金 */
  margin: number
  /* 未实现盈亏精度 */
  pnlPrecision?: number
  /* 收益率精度 */
  roiPrecision?: number
  /* 价格精度 */
  pricePrecision?: number
};

/** 根据最新价格计算未实现盈亏和收益率 */
export function getUnrealizedPnlRoi({
  price,
  avgPrice,
  contAmount,
  contractMultiplier,
  positionSide,
  margin,
  pricePrecision,
  pnlPrecision = 4,
  roiPrecision = 2,
}: UnRealizedOptions): {
  pnl: string;
  roi: string;
  orgPnl: number;
  orgRoi: number;
} {
  let orgPnl: number = 0;
  let orgRoi: number = 0;
  try {
    /**
     * 公式
     * 未实现盈亏= (最新价- 开仓均价)* 仓位数量张*合约乘数*持仓方向 #开仓均价为跟单带单开仓均价
     * 收益率= 未实现盈亏/ 保证金 #保证金为跟单带单保证金
     */
    let p = price;
    if (typeof pricePrecision === 'number' && pricePrecision >= 0) {
      p = +(digits(price, pricePrecision));
    }
    orgPnl = Big(p).sub(avgPrice).mul(contAmount).mul(contractMultiplier).mul(positionSide > 0 ? 1 : -1).toNumber();
    orgRoi = Big(Big(orgPnl)).div(margin).mul(100).toNumber();
  } catch (error) {
  } finally {
    return {
      pnl: '' + digits(orgPnl, pnlPrecision),
      roi: '' + digits(orgRoi, roiPrecision),
      orgPnl,
      orgRoi,
    };
  }
}
