import { getTradeConvertRateApi, getTradeExchangeCurrencyApi, postTradeExchangeApplyApi } from '@/core/api';

export class Convert {
  // 图片地址
  public static imgUrl = '/static/images/account/convert';

  // 获取汇率
  public static getConvertRate(currency: string): Promise<string | number> {
    return new Promise(async (resolve, reject) => {
      try {
        let { data }: any = await getTradeConvertRateApi(currency);
        resolve(data?.rate || 0);
      } catch (err) {
        reject(err);
      }
    });
  }

  // 获取闪兑币种
  public static geteExchangeCurrency(): Promise<Array<any>> {
    return new Promise(async (resolve, reject) => {
      try {
        let { data = [] }: { data: [] } = await getTradeExchangeCurrencyApi();
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  // 闪兑
  public static exchangeApply({ sourceAmount, sourceCurrency, targetCurrency }: { sourceCurrency: string; sourceAmount: string; targetCurrency: string }) {
    return new Promise(async (resolve, reject) => {
      try {
        let result: any = await postTradeExchangeApplyApi({ sourceAmount, sourceCurrency, targetCurrency });
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }
}
