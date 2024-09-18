/**
 * 项目中货币精度 | 法币列表 ｜ 货币列表 | 货币符号 获取
 */

import { getCurrencyRateListApi } from '@/core/api';
import { CurrencySymbol } from '@/core/shared';

class SpotCurrency {
  private static _instance: SpotCurrency;

  public scaleMap: Record<string, number> = {};
  public fiatList: string[] = []; // 法币列表
  public currencyList: string[] = []; // 货币列表

  private constructor(data: any[]) {
    for (const item of data) {
      this.scaleMap[item.code] = item.scale;
      if (item.type === 0) {
        this.fiatList.push(item.code);
      }
      this.currencyList.push(item.code);
    }
  }

  private static _cacheHttp: Promise<any>;
  public static async getInstance(): Promise<SpotCurrency> {
    if (!this._instance) {
      if (!this._cacheHttp) {
        this._cacheHttp = getCurrencyRateListApi();
      }
      const { data } = await this._cacheHttp;
      return (SpotCurrency._instance = new SpotCurrency(data || []));
    }
    return this._instance;
  }

  // 获取某个货币精度
  public static async getScale(currency: string): Promise<number> {
    await this.getInstance();
    return this._instance.scaleMap[currency] || 2;
  }

  // 获取所有货币精度
  public static async getScaleMap(): Promise<Record<string, number>> {
    await this.getInstance();
    return this._instance.scaleMap;
  }

  // 获取法币列表
  public static async getFiatList(): Promise<string[]> {
    await this.getInstance();
    return this._instance.fiatList;
  }

  // 获取货币列表
  public static async getCurrencyList(): Promise<string[]> {
    await this.getInstance();
    return this._instance.currencyList;
  }

  // 获取非法币列表
  public static async getNonFiatList(): Promise<string[]> {
    await this.getInstance();
    return this._instance.currencyList.filter((item) => !this._instance.fiatList.includes(item));
  }

  // 获取货币符号
  public static getCurrencySymbol(currency: string): string {
    return CurrencySymbol[currency] || currency;
  }
}

export { SpotCurrency };
