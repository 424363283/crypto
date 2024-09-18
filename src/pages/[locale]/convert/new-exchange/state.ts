/**
 *
 * 币币闪兑
 *
 */
import { getCommonCurrencyListApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import { message } from '@/core/utils';
import React from 'react';
import { useImmer } from 'use-immer';

const localCurrency = 'USDT';

let time: any = null;
const Convet = () => {
  const [state, setState] = useImmer({
    currency: 'BTC',
    aMoeny: '', // 卖
    bMoeny: '', // 买
    targetFocus: '', // 记住最后离开的输入框 为刷新的换算基准
    currencyPrice: '' as string | number,
    currencyList: [] as any,
    data: [] as any,
  });
  const { allSpotAssets } = Account.assets.spotAssetsStore;
  React.useEffect(() => {
    Account.assets.getAllSpotAssets();
  }, []);
  React.useEffect(() => {
    geteExchangeCurrency();
    _getCurrencyList();
  }, []);

  React.useEffect(() => {
    _getRate(state.currency);
  }, [state.currency]);

  React.useEffect(() => {
    return () => {
      time && clearTimeout(time);
    };
  }, []);

  const _getCurrencyList = async () => {
    const { data }: any = await getCommonCurrencyListApi(1);
    setState((draft) => {
      draft.data = data;
    });
  };

  // 获取汇率
  const _getRate = async (currency: string) => {
    clearTimeout(time);
    try {
      const currencyPrice: string | number = await Account.convert.getConvertRate(currency);
      setState((draft) => {
        draft.currencyPrice = currencyPrice;
      });
    } catch (error) {}
    time = setTimeout(() => {
      _getRate(currency);
    }, 2000);
  };

  // 获取汇率
  const geteExchangeCurrency = async () => {
    const list: Array<any> = await Account.convert.geteExchangeCurrency();
    setState((draft: any) => {
      draft.currencyList = list
        .filter((item) => item !== 'USDT')
        .map((code) => {
          return { code };
        });
    });
  };

  // 兑换
  const submit = async ({ scale }: { scale: number }) => {
    try {
      const res: any = await Account.convert.exchangeApply({
        sourceCurrency: state.currency,
        sourceAmount: state.aMoeny?.toFixed(scale) || '0',
        targetCurrency: localCurrency,
      });
      setState((draft) => {
        draft.aMoeny = '';
        draft.bMoeny = '';
      });
      if (res?.code === 200) {
        message.success(LANG('兑换成功'));
      } else {
        message.error(res?.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  // 实时汇率换算
  const item: any = allSpotAssets.find((_: any) => _.code === state.currency) || {};
  const usdt_item: any = allSpotAssets.find((_: any) => _.code === 'USDT') || {};
  const scale = state.data?.find((_: { scale: number; code: string }) => _.code === state.currency)?.scale || 0;

  React.useEffect(() => {
    const price = state?.currencyPrice;
    if (price) {
      if (state.targetFocus === 'a') {
        const bMoeny = price?.mul(state.aMoeny);
        setState((draft) => {
          draft.bMoeny = +bMoeny ? bMoeny : '';
        });
      }
      if (state.targetFocus === 'b') {
        const aMoeny = state.bMoeny.div(price).toFixed(scale);
        setState((draft) => {
          draft.aMoeny = +aMoeny ? aMoeny : '';
        });
      }
    }
  }, [state?.currencyPrice, state.targetFocus, state.aMoeny, state.bMoeny]);

  return { state, setState, submit, item, currencyList: state.currencyList, scale, usdt_item };
};

export default Convet;
