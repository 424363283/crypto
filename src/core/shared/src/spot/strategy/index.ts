import { getSpotAssetApi } from '@/core/api';
import { LIST_TYPE } from '../position/types';
import { state } from './state';
// 现货网格交易逻辑
export class Strategy {
  public static state = state;
  
  public static init() {}
  // 选择策略类型
  public static changeSelectType(type: LIST_TYPE | null) {
    Strategy.state.selectType = type;
  }

  // 获取现货账户余额
  public static async getBalance(coin = 'USDT') {
    try {
      const res = await getSpotAssetApi();
      if (res.code === 200) {
        const { data: spotList } = res;
        const quoteCoinItem = spotList?.find((item) => item.currency === coin);
        Strategy.state.balance = quoteCoinItem?.balance || 0;
      }
    } catch (err) {
      Strategy.state.balance = 0;
    }
  }
}
