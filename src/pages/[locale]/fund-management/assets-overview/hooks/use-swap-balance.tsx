import { useRate } from '@/core/hooks/src/use-rate';
import { Account, Swap } from '@/core/shared';
import { BalanceData } from '@/core/shared/src/swap/modules/assets';
import { formatNumber2Ceil, getCurrencyDigit } from '@/core/utils';
import { useEffect } from 'react';

export const useSwapBalance = () => {
  useEffect(() => {
    return Swap.fetchInitData();
  }, []);
  Swap.useListener({ assets: true });

  return { swapBalance: useBalance({ usdt: false }), swapUBalance: useBalance({ usdt: true }) };
};
const useBalance = ({ usdt }: { usdt: boolean } = { usdt: false }) => {
  const wallets = usdt ? Account.assets.swapUAssetsStore.wallets : Account.assets.swapAssetsStore.wallets;
  const getValue = useRate().getValue;

  useEffect(() => {
    return Swap.Info.subscribeAgreementIsAllow(() => {
      Swap.Order.fetchPosition(usdt);
      Swap.Assets.fetchBalance(usdt);
    });
  }, [usdt]);

  let margin = 0;
  // if (!usdt) console.log(usdt, wallets);
  const marginTotal = (wallets as any).reduce((r: any, data: any) => {
    const totalData = Swap.Assets.getBalanceTotalData({
      usdt: usdt,
      balanceData: data.accounts as any,
      getValue: getValue,
    });

    const foo = useMarginTotal(usdt, totalData).add(totalData.bonusAmount);
    return r.add(foo);
  }, 0);
  const unrealisedPNL = getUnrealisedPNL(usdt, useUnrealisedPNLObject({ positions: [], usdt }));

  margin = Number(marginTotal?.add(unrealisedPNL));

  return margin < 0 ? 0 : margin;
};

/**
 * @param usdt
 * @param balance
 * @param validatePositionMode 验证仓位模式
 * @returns
 */
export const useMarginTotal = (usdt: boolean, balance: BalanceData, validatePositionMode?: boolean) => {
  if (usdt) {
    return balance.accb - balance.frozen;
  } else {
    if (!validatePositionMode) {
      return balance.accb;
    }
    const positions = Swap.Order.getPosition(usdt);
    const { getValue } = useRate();
    const balanceC = Swap.Assets.getBalanceCData();
    return Object.keys(balanceC).reduce((sum, code) => {
      const item = balanceC[code];
      const isCross = Swap.Info.getIsCrossByPositionData(`${code}-USD`, positions);
      const value = Number(isCross ? item.accb : item.positionMargin);
      return Number(sum.add(getValue({ currency: code, exchangeRateCurrency: 'USD', money: value })));
    }, 0);
  }
};
export const useUnrealisedPNLObject = ({ positions, usdt }: { positions: any[]; usdt: boolean }) => {
  Swap.Socket.store.data1050;
  const data = Swap.Calculate.positionData({ usdt: usdt, data: positions, twoWayMode: Swap.Trade.twoWayMode });
  return {};
  // return Object.keys(data.data).reduce((r, key) => {
  //   const { income, crossIncomeLoss } = data.data[key];
  //   key = !usdt ? key.toUpperCase().split('-')[0] : 'USDT';
  //   return {
  //     ...r,
  //     [key]: {
  //       value: usdt ? data.allIncome : income,
  //       crossIncome: usdt ? data.allCrossIncomeLoss : crossIncomeLoss,
  //     },
  //   };
  // }, {});
};
export const getUnrealisedPNL = (usdt: boolean, data: any) => {
  const { getValue } = useRate();
  return Object.keys(data).reduce(
    (r: any, key: any) =>
      Number(r.add(getValue({ currency: key, exchangeRateCurrency: 'USD', money: data[key].value }))),
    0
  ) as number;
};

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
      crypto.unrealisedPNL = formatNumber2Ceil(
        `${isSwapU ? calcWallet.allIncome : calcQuote.income}`,
        digit,
        false
      ).toFixed(digit);
      // data
      data.accb = data.accb.add(getUsdValue(crypto.accb)).toFixed(usdtDigit);
      data.margin = data.margin.add(getUsdValue(crypto.margin)).toFixed(usdtDigit);
      data.totalMargin = data.totalMargin
        .add(getUsdValue(isSwapU ? account.accb.sub(account.frozen) : crypto.accb))
        .toFixed(usdtDigit);
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
