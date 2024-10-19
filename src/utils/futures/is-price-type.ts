import { PriceTypes } from './';

/** 是否为下单类型 */
export const isPriceType = (type: any): boolean => new RegExp(`^[${[PriceTypes.INPUT, PriceTypes.MARKET_PRICE, PriceTypes.PLAN, PriceTypes.MAKER].join('')}]$`).test(type);