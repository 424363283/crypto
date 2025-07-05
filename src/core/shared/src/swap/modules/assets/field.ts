import { RateTextProps, useRate } from '@/core/hooks';
import { useAppContext } from '@/core/store';
import { Store } from '@/core/store/src/resso'; 
import { Account } from '../../../account';
import { ISwapAsset, ISwapAssetWallet } from '../../../account/assets/types';
import { Calculate } from '../calculate';
import { infoInstance as Info } from '../info';
import { orderInstance as Order } from '../order';
import { socketInstance as Socket } from '../socket';
import { Utils } from '../utils';
import { SWAP_BOUNS_WALLET_KEY, SWAP_GRID_WALLET_KEY } from './constants';
import { formatBalanceResult } from './utils';

export type BalanceData = {
  accb: number;
  positionMargin: number;
  frozen: number;
  bonusAmount: number;
  availableBalance: number;
  canWithdrawAmount: number;
  unrealisedPNL: number;
  currency: string;
  voucherAmount: number;
  equity?: number;
};
type StoreType = Store<{}>;

export class AssetsField {
  DEFAULT_BALANCE: BalanceData = { accb: 0, positionMargin: 0, frozen: 0, bonusAmount: 0, availableBalance: 0, canWithdrawAmount: 0, unrealisedPNL: 0, voucherAmount: 0, currency: '', equity: 0 };

  // late
  store: StoreType = {} as StoreType;

  getBalanceCData({ withHooks = true, walletId }: { withHooks?: boolean; walletId?: string } = {}): { [key: string]: BalanceData } {
    let data = (withHooks ? Account.assets.swapAssetsStore.assets : Account.assets.swapAssetsStore.getSnapshot('assets'))?.accounts;
    const wallets = this.getWallets({ withHooks, usdt: false });
    if (walletId) {
      const walletData = wallets.find((v) => v.wallet === walletId);
      if (walletData) {
        data = walletData.accounts;
      }
    }

    const next: { [key: string]: BalanceData } = {};
    if (!data) {
      return {};
    }
    Object.keys(data).map((key) => {
      const code = key?.replace(/-s?usd/i, '')?.toUpperCase() || '';
      next[code] = formatBalanceResult(data[key]);
    });
    return next;
  }

  getBalanceUData({ withHooks, walletId }: { withHooks?: boolean; walletId?: string }): { [key: string]: BalanceData } {
    let data = (withHooks ? Account.assets.swapUAssetsStore.assets : Account.assets.swapUAssetsStore.getSnapshot('assets'))?.accounts;
    const next: { [key: string]: BalanceData } = {};
    const wallets = this.getWallets({ withHooks, usdt: true });

    if (walletId) {
      const walletData = wallets.find((v) => v.wallet === walletId);
      if (walletData) {
        data = walletData.accounts;
      }
    }
    if (!data) {
      return {};
    }
    Object.keys(data).map((key) => {
      const code = key?.replace(/-s?usd/i, '')?.toUpperCase() || '';

      next[code] = formatBalanceResult(data[key]);
    });

    return next;
  }

  getAssetStore = (usdt?: boolean) => (usdt ? Account.assets.swapUAssetsStore : Account.assets.swapAssetsStore);

  walletFormat(data: any = {}): ISwapAssetWallet {
    let alias = data['alias'] ?? data['wallet'] ?? '';
    // if (data['wallet'] == SWAP_BOUNS_WALLET_KEY) {
    //   alias = ![null, '', SWAP_BOUNS_WALLET_KEY].includes(data['alias']) ? data['alias'] : LANG('体验金钱包');
    // }
    return {
      ...data,
      alias: alias,
      edit: ![SWAP_GRID_WALLET_KEY, SWAP_BOUNS_WALLET_KEY].includes(data['wallet']),
    };
  }
  getWallets({ usdt, withHooks = true }: { usdt?: boolean; withHooks?: boolean }): ISwapAsset['wallets'] {
    const data: ISwapAsset['wallets'] = withHooks ? this.getAssetStore(usdt).wallets : this.getAssetStore(usdt).getSnapshot('wallets');

    return data;
  }
  getWallet({ usdt, walletId, withHooks = true }: { usdt?: boolean; walletId?: string; withHooks?: boolean }): ISwapAssetWallet | undefined {
    const data: ISwapAsset['wallets'] = withHooks ? this.getAssetStore(usdt).wallets : this.getAssetStore(usdt).getSnapshot('wallets');
    const item = data.find((v) => v.wallet === walletId);
    return item ? this.walletFormat(item) : item;
  }

  getBalanceData({ code, usdt, withHooks = true, walletId }: { code?: string; usdt?: boolean; withHooks?: boolean; walletId?: string }) {
    const _usdt = usdt === undefined ? Info.getIsUsdtType(code || '') : usdt;
    const udata = this.getBalanceUData({ withHooks, walletId });
    const cdata = this.getBalanceCData({ withHooks, walletId });
    if (_usdt) {
      return Object.values(udata)[0] || { ...this.DEFAULT_BALANCE };
    } else {
      return cdata?.[code?.replace(/-s?usd/i, '')?.toUpperCase() || ''] || { ...this.DEFAULT_BALANCE };
    }
  }

  getBalanceTotalData({ usdt, balanceData, getValue: _getValue }: { usdt?: boolean; balanceData?: { [key: string]: BalanceData }; getValue?: (props: RateTextProps) => string | 0 }) {
    const getValue = _getValue || useRate().getValue;
    const _usdt = usdt;
    const udata = balanceData || this.getBalanceUData({ withHooks: true });
    const cdata = balanceData || this.getBalanceCData({ withHooks: true });
    if (_usdt) {
      return udata?.USDT || { ...this.DEFAULT_BALANCE };
    } else {
      const balance = { ...this.DEFAULT_BALANCE };

      Object.keys(cdata).forEach((code) => {
        const item = cdata[code];
        balance.accb = Number(balance.accb.add(getValue({ exchangeRateCurrency: 'USD', currency: code, money: item.accb })));
        balance.positionMargin = Number(balance.positionMargin.add(getValue({ exchangeRateCurrency: 'USD', currency: code, money: item.positionMargin })));
        balance.frozen = Number(balance.frozen.add(getValue({ exchangeRateCurrency: 'USD', currency: code, money: item.frozen })));
        balance.bonusAmount = Number(balance.bonusAmount.add(getValue({ exchangeRateCurrency: 'USD', currency: code, money: item.bonusAmount })));
        balance.availableBalance = Number(balance.availableBalance.add(getValue({ exchangeRateCurrency: 'USD', currency: code, money: item.availableBalance })));
        balance.canWithdrawAmount = Number(balance.canWithdrawAmount.add(getValue({ exchangeRateCurrency: 'USD', currency: code, money: item.canWithdrawAmount })));
        balance.unrealisedPNL = Number(balance.unrealisedPNL.add(getValue({ exchangeRateCurrency: 'USD', currency: code, money: item.unrealisedPNL })));
        balance.voucherAmount = Number(balance.voucherAmount.add(getValue({ exchangeRateCurrency: 'USD', currency: code, money: item.voucherAmount })));
      });
      return balance;
    }
  }
  //全仓：可用余额=钱包余额accb-仓位保证金positionMargin-冻结金额frozen+未实现亏损unrealisedPNL（只计算亏损，不计算盈利）
  //逐仓：可用余额=钱包余额accb-仓位保证金positionMargin-冻结金额frozen
  getDisplayBalance({ code, walletId }: { code: string; walletId: string }) {
    // const { positionCrossIncomeLoss, positionProfitAndLoss } = this.state;
    const usdt = Info.getIsUsdtType(code || '');
    const { basePrecision } = Info.getCryptoData(code);
    const { isLogin } = useAppContext();
    const { marginType } = Info.getLeverFindData(code);
    Socket.store.data1050;
    const calcData = Calculate?.positionData({ usdt: usdt, data: Order?.getPosition(usdt), symbol: code, twoWayMode: Info.getTwoWayMode(usdt) });

    const crossIncomeLoss = usdt ? calcData.wallets?.[walletId]?.allCrossIncomeLoss : calcData.wallets?.[walletId]?.data[code]?.crossIncomeLoss;
    const balanceData = this?.getBalanceData({ code, walletId });
    const twoWayMode = Info?.getTwoWayMode(usdt);
    const positionLoaded = Order.store.positionLoaded;

    let balance: string | number = Calculate.balance({
      usdt: usdt,
      twoWayMode,
      balanceData,
      // isCross: marginType === 1,
      isCross: true,
      crossIncome: Number(crossIncomeLoss || 0),
    });
    const balanceDigit = this.getBalanceDigit({ code });
    if (!positionLoaded) {
      balance = balanceData.availableBalance;
    }
    balance = balance.toFixed(balanceDigit);
    if (!isLogin) {
      return 0;
    }
    return Utils.numberDisplayFormat(balance);
  }

  getBalanceDigit({ code, usdt, withHooks = true }: { code?: string; usdt?: boolean; withHooks?: boolean }) {
    const { basePrecision } = Info.getCryptoData(code || '', { withHooks });
    const digit = usdt ?? Info.getIsUsdtType(code?.toUpperCase() || '') ? Info.usdtVolumeDigit : basePrecision;

    return digit;
  }
}
