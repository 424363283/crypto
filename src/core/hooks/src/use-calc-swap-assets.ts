import { useRate } from '@/core/hooks/src/use-rate';
import { Swap } from '@/core/shared';
import { formatNumber2Ceil, getCurrencyDigit } from '@/core/utils';

export type CalcSwapAsset = {
  wallet?: string;
  pic?: string;
  alias?: string;
  remark?: string;
  url?: string;
  accb: string;
  margin: string;
  totalMargin: string;
  canWithdrawAmount: string;
  unrealisedPNL: string;
  bonusAmount: string;
  voucherAmount: string;
  cryptos: {
    [key: string]: { currency: string; accb: string; margin: string; canWithdrawAmount: string; unrealisedPNL: string };
  };
};

export const useCalcSwapAssets = ({ isSwapU }: { isSwapU: boolean }) => {
  Swap.Socket.store.data1050;
  const result: CalcSwapAsset[] = [];
  const wallets = Swap.Assets.getWallets({ usdt: isSwapU });

  const positionsAll = Swap.Order.getPosition(isSwapU);
  const getValue = useRate().getValue;
  const { wallets: calcWallets } = Swap.Calculate.positionData({
    usdt: isSwapU,
    data: positionsAll,
    getRateValue: (currency: string, v) => getValue({ currency, money: v }),
  });
  const total = {
    accb: '0',
    margin: '0',
    totalMargin: '0',
    totalMargin2: '0',
    unrealisedPNL: '0',
    bonusAmount: '0',
    voucherAmount: '0',
    crossIncomeLoss: '0',
  };
  const defaultCrypto = {
    currency: '',
    accb: '0',
    margin: '0',
    canWithdrawAmount: '0',
    unrealisedPNL: '0',
  };
  wallets.forEach((wallet) => {
    const calcWallet = calcWallets?.[wallet.wallet] || { allCrossIncomeLoss: '0', allIncome: '0' };
    const data: CalcSwapAsset = {
      wallet: '0',
      pic: '0',
      alias: '0',
      remark: '0',
      url: undefined,
      accb: '0',
      margin: '0',
      totalMargin: '0',
      canWithdrawAmount: '0',
      unrealisedPNL: '0',
      bonusAmount: '0',
      voucherAmount: '0',
      cryptos: {},
    };
    data.wallet = wallet.wallet;
    data.pic = wallet.pic;
    data.alias = wallet.alias;
    data.remark = wallet.remark;
    data.url = wallet.url;
    const usdtDigit = getCurrencyDigit('USDT');
    const positions = Swap.Order.getPosition(isSwapU, { withHooks: false, walletId: wallet.wallet });

    let incomeTotal: string | number = '0';

    Object.values(wallet.accounts).forEach((account) => {
      const crypto = { ...defaultCrypto };
      const currency = account.currency || '';
      const quoteId = `${currency}-${isSwapU ? 'USDT' : 'USD'}`;
      const calcQuote = calcWallet?.data?.[quoteId] || { crossIncomeLoss: '0', income: '0' };
      const getUsdValue = (v: any) => getValue({ currency: currency, exchangeRateCurrency: 'USD', money: v });
      const isCross = Swap.Info.getIsCrossByPositionData(
        quoteId,
        positions.filter((v) => v.subWallet === wallet.wallet)
      );
      const digit = getCurrencyDigit(currency);
      // crypto
      crypto.currency = currency;
      crypto.accb = account.accb.toFixed(digit);
      if (isSwapU) {
        crypto.margin = account.accb.add(calcWallet.allCrossIncomeLoss);
      } else {
        crypto.margin = (isCross ? account.accb : account.positionMargin).add(calcQuote.crossIncomeLoss);
      }

      incomeTotal = incomeTotal.add(calcWallet.allIncome);
      if (Number(crypto.margin) < 0) {
        crypto.margin = '0';
      }
      crypto.margin = crypto.margin.toFixed(digit);
      crypto.canWithdrawAmount = account.canWithdrawAmount.toFixed(digit);
      crypto.unrealisedPNL = formatNumber2Ceil(`${isSwapU ? calcWallet.allIncome : calcQuote.income}`, digit, false).toFixed(digit);
      // data
      data.accb = data.accb.add(getUsdValue(crypto.accb)).toFixed(usdtDigit);
      data.margin = data.margin.add(getUsdValue(crypto.margin)).toFixed(usdtDigit);
      data.totalMargin = data.totalMargin.add(getUsdValue(isSwapU ? account.accb.sub(account.frozen) : crypto.accb)).toFixed(usdtDigit);
      data.canWithdrawAmount = data.canWithdrawAmount.add(getUsdValue(crypto.canWithdrawAmount)).toFixed(usdtDigit);
      data.unrealisedPNL = data.unrealisedPNL.add(getUsdValue(crypto.unrealisedPNL)).toFixed(usdtDigit);
      data.voucherAmount = data.voucherAmount.add(getUsdValue(account.voucherAmount)).toFixed(usdtDigit);
      data.bonusAmount = data.bonusAmount.add(getUsdValue(account.bonusAmount)).toFixed(usdtDigit);
      data.cryptos[currency] = crypto;
    });
    result.push(data);

    // total
    total.accb = total.accb.add(data.accb);
    total.margin = total.margin.add(data.margin);
    total.totalMargin = total.totalMargin.add(data.totalMargin);
    total.totalMargin2 = total.totalMargin2.add(data.totalMargin).add(incomeTotal);
    total.unrealisedPNL = total.unrealisedPNL.add(data.unrealisedPNL);
    total.voucherAmount = total.voucherAmount.add(data.voucherAmount);
    total.bonusAmount = total.bonusAmount.add(data.bonusAmount);
  });
  total.totalMargin2 = total.totalMargin2.add(total.bonusAmount);
  return { total, wallets: result };
};
