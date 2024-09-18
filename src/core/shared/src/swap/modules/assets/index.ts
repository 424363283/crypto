import { Account } from '@/core/shared';
import { Debounce } from '@/core/utils';
import { AssetsField } from './field';

export type { BalanceData } from './field';

export class Assets extends AssetsField {
  _fetchSwapCoinBalanceDebounce = new Debounce(() => {}, 200);
  _fetchSwapUsdtBalanceDebounce = new Debounce(() => {}, 200);

  init({ resso }: any) {
    this.store = resso({});
  }

  async fetchSwapCoinBalance(forceFetch: boolean = true) {
    const result: any = await Account.assets.getPerpetualAsset(forceFetch);
    return result;
  }

  async fetchSwapUsdtBalance(forceFetch: boolean = true) {
    const result: any = await Account.assets.getPerpetualUAsset(forceFetch);

    return result;
  }

  fetchBalance(usdt: boolean, debounce: boolean = true) {
    if (!Account.isLogin) return;
    if (!usdt) {
      // TODO debounce ? this._fetchSwapCoinBalanceDebounce.run(() => this.fetchSwapCoinBalance()) : this.fetchSwapCoinBalance();
    } else {
      debounce ? this._fetchSwapUsdtBalanceDebounce.run(() => this.fetchSwapUsdtBalance()) : this.fetchSwapUsdtBalance();
    }
  }
}

export const assetsInstance = new Assets();
