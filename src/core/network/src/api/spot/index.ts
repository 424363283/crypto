/**
 * 现货交易相关的接口合集
 */

import { SpotPositionListItem } from '@/core/shared';
import { http } from '../../http/request';
import { paths } from '../paths';
import { SpotCurrencyCostProps, SpotPositionProps } from './types';

/** 获取现货交易商品详情列表 */
export function getSpotTradeListApi() {
  return http.get(paths['spot_trade_list']);
}
/** 现货网格持仓列表 */
export function getSpotGridPositionListApi() {
  return http.get(paths['spot_grid_position_list']);
}

/** 现货定投持仓列表 */
export function getSpotInvestPositionListApi() {
  return http.get(paths['spot_invest_position_list']);
}

/** 现货币种成本 */
export function getSpotCurrencyCostApi() {
  return http.get<SpotCurrencyCostProps>(paths['spot_currency_cost']);
}
/** 现货持仓 */
export function getSpotPositionApi(data: { orderTypes: string; rows: number; commodity?: string; type?: number; side: number; buy?: boolean }) {
  return http.get<SpotPositionProps>(paths['spot_position'], { params: { ...data, rows: data.rows || 10 } });
}

/** 现货撤单 */
export function closeSpotOrderApi(data: string[]) {
  return http.post<object>(paths['spot_close'], data);
}

/** 现货历史成交 */
export function getSpotHistoryDetailApi(data: { rows?: number; symbol?: string; openTypes: string; createTimeGe: string; createTimeLe: string; commodity?: string; buy?: boolean; side?: number }) {
  return http.get<{
    list: [];
    count: string;
    page: number;
    size: number;
    totalPage: number;
  }>(paths['spot_history_detail'], { params: data });
}

/** 现货历史委托 */
export function getSpotHistoryCommissionApi(data: { rows?: number; symbol?: string; orderTypes: string; createTimeGe?: string; createTimeLe?: string; commodity?: string; buy?: boolean; side?: number; page?: number }) {
  return http.get<{
    list: [];
    count: string;
    page: number;
    size: number;
    totalPage: number;
  }>(paths['spot_history'], { params: data });
}
/** 现货历史记录导出 */
export function getSpotHistoryExportApi(data: { createTimeGe: string; createTimeLe: string; openTypes: string[] }) {
  return http.get<object>(paths['spot_history_order_export'], {
    params: data,
    responseType: 'blob',
  });
}
/** 获取现货持仓列表 */
export function getSpotPositionListApi(data: { orderTypes?: string; rows?: number; commodity?: string; type?: number; side?: number; buy?: boolean }) {
  return http.get<SpotPositionListItem[]>(paths['spot_position'], {
    params: data,
  });
}
/** 现货下单 */
export function postSpotOpenOrderApi(data: any) {
  return http.post(paths['spot_open'], data);
}
