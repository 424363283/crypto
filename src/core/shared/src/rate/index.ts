import { getCommonExchangeRateListApi } from '@/core/api';
import { R } from '@/core/network';
import { resso } from '@/core/resso';
import { CurrencySymbol } from '@/core/shared';
import { LOCAL_KEY, localStorageApi } from '@/core/store';
import { asyncFactory } from '@/core/utils/src/async-instance';
import memoize from 'fast-memoize';
import { SpotCurrency } from './spot-currency';

interface RateParams {
  money: string | number;
  currency?: string;
  exchangeRateCurrency?: string;
  scale?: number; // 自定义精度
  useScale?: boolean; // 是否使用精度
}

class Rate {
  private static instance: Rate;
  private static cacheHttp: Promise<[R<object[]>, SpotCurrency, string]>;

  public static store = resso({
    currency: 'USD', // 货币
    unit: '$', // 货币单位符号
    rate: 1, // 汇率
    rateMap: {} as Record<string, number>, // 货币汇率列表
    rateScaleMap: {} as Record<string, number>, // 货币汇率精度列表
    fiatList: [] as string[], // 法币列表
  });

  private constructor(data: any, spotCurrency: SpotCurrency, localCurrency: string) {
    Rate.store.currency = localCurrency;
    Rate.store.rateScaleMap = spotCurrency.scaleMap;
    Rate.store.fiatList = spotCurrency.fiatList;
    this.processCurrencyData(data);
  }

  // 处理货币数据
  private processCurrencyData(data: any): void {
    if (!data) return;
    Rate.store.unit = CurrencySymbol[Rate.store.currency];
    const _rateMap: Record<string, number> = {};
    for (const item of data) _rateMap[item.currency] = item.rate || 0;
    Rate.store.rateMap = _rateMap;
    Rate.store.rate = Rate.store.rateMap[Rate.store.currency];
  }

  // 实力化
  static async getInstance(): Promise<Rate> {
    return await asyncFactory.getInstance<Rate>(async (): Promise<Rate> => {
      const localCurrency = localStorageApi.getItem<string>(LOCAL_KEY.RATE_DEFAULT_CURRENCY) || 'USD';
      const { data } = await getCommonExchangeRateListApi('USD', false);
      const currency = await SpotCurrency.getInstance();
      Rate.instance = new Rate(data, currency, localCurrency);
      return Rate.instance;
    }, Rate);
  }

  // 获取符号,eg:$, $,￥
  public get localSymbol() {
    return Rate.store.unit || Rate.store.currency;
  }

  public get log() {
    return Rate.store.log;
  }

  // 计算汇率
  // 使用 memoize 进行缓存处理
  private _calcMoneyByRate = memoize(({ money, currencyRate, exchangeRate, localRateScale, useScale = true }: { money: string | number; currencyRate: number; exchangeRate: number; localRateScale: number; useScale?: boolean }) => {
    if (useScale) {
      return money.mul(currencyRate).div(exchangeRate).toFixed(localRateScale);
    }
    return money.mul(currencyRate).div(exchangeRate);
  });

  public calcMoney = ({ money, currency = 'USDT', exchangeRateCurrency, scale, useScale }: RateParams): string => {
    const rateMap = Rate.store.getSnapshot('rateMap');
    const rateScaleMap = Rate.store.getSnapshot('rateScaleMap');
    const storeCurrency = Rate.store.getSnapshot('currency');
    const _currencyRate = rateMap[currency] || 0;
    const _exchangeRate = rateMap[exchangeRateCurrency || storeCurrency] || 0;
    const localRateScale = scale || rateScaleMap[storeCurrency] || 2;

    return this._calcMoneyByRate({
      money,
      currencyRate: _currencyRate,
      exchangeRate: _exchangeRate,
      localRateScale,
      useScale,
    });
  };
  // 根据币种定义的scale做精度处理
  public formatMoneyByScale({ money, currency = 'USDT', exchangeRateCurrency }: RateParams): number {
    const rateScaleMap = Rate.store.getSnapshot('rateScaleMap');
    const localRateScale = rateScaleMap[currency] || 2;
    return parseFloat(money.toFixed(localRateScale));
  }

  // 获取汇率
  public toRate(params: RateParams): string {
    return this.calcMoney(params);
  }

  // 带符号的汇率
  public toRateUnit(params: RateParams): string {
    return this.localSymbol + ' ' + this.calcMoney(params);
  }

  // 后缀汇率
  public toRateSuffix(params: RateParams): string {
    return this.calcMoney(params) + ' ' + this.localSymbol;
  }

  // 带符号的汇率 list
  public toRateUnitList(params: RateParams): string[] {
    return [this.localSymbol, this.calcMoney(params)];
  }
  // 同等值货币兑换，例如：100 USDT 兑换 0.0038 BTC
  public toRateUnitByEqualValue = memoize((params: { money: string | number; toCurrency: string; scale?: number }) => {
    const rateMap = Rate.store.getSnapshot('rateMap');
    const rateScaleMap = Rate.store.getSnapshot('rateScaleMap');
    const targetValue = rateMap[params.toCurrency] || 1;
    const localRateScale = params.scale || rateScaleMap[params.toCurrency] || 2;
    return params.money.div(targetValue).toFixed(localRateScale);
  });

  // 修改货币
  public async updateCurrency(currency: string): Promise<Rate | false> {
    if (!currency) return false;
    if (Rate.store.fiatList.indexOf(currency) == -1) return false;
    try {
      Rate.store.currency = currency; // 货币
      Rate.store.unit = CurrencySymbol[currency]; // 货币单位符号
      Rate.store.rate = Rate.store.rateMap[currency]; // 汇率
      localStorageApi.setItem(LOCAL_KEY.RATE_DEFAULT_CURRENCY, currency);
      return Rate.instance;
    } catch {
      return false;
    }
  }
}

export { Rate };
