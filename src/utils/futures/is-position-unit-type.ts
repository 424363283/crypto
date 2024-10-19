import { PositionUnitTypes } from './';

/** 是否为持仓单位 */
export const isPositionUnitType = (type: any): boolean => new RegExp(`^[${[PositionUnitTypes.CONT, PositionUnitTypes.COIN, PositionUnitTypes.USDT]}]`).test(type);