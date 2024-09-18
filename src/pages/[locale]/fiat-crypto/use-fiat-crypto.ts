import { Loading } from '@/components/loading';
import { postAccountVerifyPasswordApi } from '@/core/api';
import { useIndexedDB, useRouter } from '@/core/hooks';
import { useRate } from '@/core/hooks/src/use-rate';
import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import { IDB_STORE_KEYS, resso, useLoginUser } from '@/core/store';
import { message } from '@/core/utils';
import { Draft } from 'immer';
import { useEffect, useMemo } from 'react';

interface IState {
  currencyOptions: Array<any>;
  cryptoOptions: Array<any>;
  currencyQuotas: Array<any>;
  currencySelected: { code: string };
  cryptoSelected: { code: string };
  loading: boolean;
  currencyAmount: string;
  paymentMethods: Array<any>;
  getPaymentMethodsTime: number;
  paymentMethodsLoading: boolean;
  refreshKey: number;
  coin: string;
  type: number;
  coinAmount: string;
  withdrawModel: boolean; // 禁止提币弹窗
  kycModel: boolean; // 未KYC
  emailModel: boolean; // 邮件未绑定
  safetyModel: boolean; // 未二级安全认证
  pwdModel: boolean; // 资金密码
  safetyVerificationModel: boolean; // 安全验证
  hasError: boolean; // 资金密码按钮
  password: string; // 资金密码
  showIdVerificationModal: boolean;
  payModal: boolean;
  currencyData: Array<any>;
  coinData: Array<any>;
  sellAmountMax: number;
  sellAmountMin: number;
  sellQuotas: Array<any>;
  amountIndex: number;
  bankIndex: number;
  key: number;
  sellParams: object;
  vToken: string;
  isBuy: boolean;
  currencyCode: string;
  cryptoCode: string;
  amountMax: string;
  amountMin: string;
  rate: string;
  payData: object;
}
let _getPaymentMethodsTime = +new Date();

const AmountOptions = Account.fiatCrypto.AmountOptions;
const getBankOptions = Account.fiatCrypto.getBankOptions;
const isAmountCode = Account.fiatCrypto.isAmountCode;
const isBankCode = Account.fiatCrypto.isBankCode;

const myStore = resso({
  sellParams: {},
  vToken: '',
  amountIndex: 0,
  bankIndex: 0,
  key: 0,
  currencyOptions: [{ code: 'USD' }],
  cryptoOptions: [{ code: 'USDT' }],
  currencyQuotas: [],
  currencySelected: { code: 'USD' },
  cryptoSelected: { code: 'USDT' },
  loading: true,
  currencyAmount: '',
  paymentMethods: [],
  getPaymentMethodsTime: _getPaymentMethodsTime,
  paymentMethodsLoading: false,
  refreshKey: +new Date(),
  coin: 'USDT',
  type: 1,
  coinAmount: '',
  withdrawModel: false, // 禁止提币弹窗
  kycModel: false, // 未KYC
  emailModel: false, // 邮件未绑定
  safetyModel: false, // 未二级安全认证
  pwdModel: false, // 资金密码
  safetyVerificationModel: false, // 安全验证
  hasError: true,
  password: '',
  showIdVerificationModal: false, // 是否显示身份验证弹窗
  payModal: false,
  currencyData: [],
  coinData: [],
  sellAmountMax: 0,
  sellAmountMin: 0,
  sellQuotas: [],
  isBuy: true,
  currencyCode: '',
  cryptoCode: '',
  amountMax: '',
  amountMin: '',
  rate: '',
  payData: { code: '', name: '' },
});
const State = () => {
  const router = useRouter();
  const { getValue } = useRate();
  const state: any = myStore;
  const setState = (func: (o: any) => any) => {
    func(state);
  };

  const isBuy = state.type === 1;
  const { code: _code, locale, coin: _coin }: { coin?: string; code?: string; locale: string } = router.query;
  const code = _code?.toUpperCase();
  const { user }: any = useLoginUser();
  const {
    coinAmount,
    currencyAmount,
    paymentMethods,
    type,
    currencyOptions,
    currencySelected,
    cryptoOptions,
    cryptoSelected,
    password,
    key,
    amountIndex,
    bankIndex,
    payData,
  } = state;

  const currencyCode = currencySelected.code;
  const cryptoCode = cryptoSelected.code;
  const _rate = getValue({ money: 1, currency: cryptoCode, exchangeRateCurrency: currencyCode });
  const [localPaymentData, setLocalPaymentData] = useIndexedDB(IDB_STORE_KEYS.FIAT_CRYPTO_PAYMENTS, paymentMethods);
  const { code: d_code } = payData;
  const _amount = isBuy ? currencyAmount : coinAmount;
  const isAmount = useMemo(() => isAmountCode(d_code), [d_code]);
  const isBank = useMemo(() => isBankCode(d_code), [d_code]);
  const amount = isAmount ? AmountOptions[amountIndex] : _amount;
  const amountMax = payData?.quotaMax || 0;
  const amountMin = payData?.quotaMin || 0;

  useEffect(() => {
    _getCryptoData();
  }, []);

  useEffect(() => {
    _getPaymentMethods();
    setState((draft) => {
      draft.key = 0;
    });
  }, [currencyCode, cryptoCode, type]);

  useEffect(() => {
    if (code) {
      const cryptoSelected = cryptoOptions.find((item: any) => {
        return item?.code === code;
      });
      if (!cryptoSelected) return;
      setState((draft) => {
        draft.cryptoSelected = cryptoSelected;
      });
    }
    if (_coin) {
      const _currencySelected = currencyOptions.find((item: any) => {
        return item?.code === _coin;
      });
      if (!_currencySelected) return;
      setState((draft) => {
        draft.currencySelected = _currencySelected;
      });
    }
  }, [cryptoOptions, code, currencyOptions, _coin]);

  useEffect(() => {
    setState((draft) => {
      draft.isBuy = isBuy;
      draft.currencyCode = currencyCode;
      draft.cryptoCode = cryptoCode;
      draft.amountMax = amountMax;
      draft.amountMin = amountMin;
    });
  }, [isBuy, currencyCode, cryptoCode, amountMax, amountMin]);
  useEffect(() => {
    setState((draft) => {
      draft.payData = localPaymentData[key] || { code: '', etaTime: '' };
      draft.rate = localPaymentData[key]?.price || _rate;
    });
  }, [localPaymentData, key, _rate]);
  useEffect(() => {
    const data = paymentMethods
      ?.map((item: any) => {
        return {
          ...item,
          price: item.price || _rate,
        };
      })
      .sort((a: any, b: any) => (isBuy ? a.price - b.price : b.price - a.price))
      .sort((a: any, b: any) => (a.serve === 'Banxa' ? '-1' : '0'))
      .sort((a: any, b: any) => (a.serve === 'Transak' ? '-1' : '0'))
      .sort((a: any, b: any) => (currencyCode === 'BRL' && a.serve === 'Pix' ? '-1' : '0'));
    setLocalPaymentData(data);
    setState((draft) => {
      data[0]?.price && (draft.rate = data[0]?.price);
    });
  }, [_rate, paymentMethods, currencyCode]);
  // 获取交易商
  const _getPaymentMethods = () => {
    Loading.start();
    setState((draft) => {
      draft.paymentMethodsLoading = true;
    });
    const targetArr = [cryptoCode, currencyCode];
    const sourceArr = [currencyCode, cryptoCode];
    const amountArr = [currencyAmount, coinAmount];
    const data = {
      // platform: 'web',
      target: targetArr[type - 1],
      source: sourceArr[type - 1],
      amount: Number(amountArr[type - 1]) || 1,
      type,
    };
    const date = +new Date();
    _getPaymentMethodsTime = date;
    Account.fiatCrypto
      .getPayments(data)
      .then(({ data }) => {
        if (data && _getPaymentMethodsTime === date) {
          setLocalPaymentData(data);
          setState((draft) => {
            draft.paymentMethods = data;
            draft.getPaymentMethodsTime = date;
          });
          Loading.end();
        }
      })
      .catch((err) => {
        message.error(err);
        Loading.end();
      })
      .finally(() => {
        setState((draft) => {
          draft.paymentMethodsLoading = false;
        });
        Loading.end();
      });
  };

  // 刷新交易商
  const _onRefresh = () => {
    setTimeout(() => {
      _getPaymentMethods();
    }, 10);
  };

  // 设置卖卖类型
  const _setType = (_type: number) => {
    setState((draft) => {
      draft.type = _type;
    });
  };

  // 选择法币
  const _onChangeCurrency = (value: any) => {
    const src = value instanceof Array ? value[0] : value;
    const currencySelected = currencyOptions.find((item: any) => {
      return item?.code === src?.code;
    });
    if (!currencySelected) return;
    setState((draft) => {
      draft.currencySelected = currencySelected;
    });
  };

  // 选择数字货币
  const _onChangeCrypto = (value: { code: string }) => {
    const src = value instanceof Array ? value[0] : value;
    const cryptoSelected = cryptoOptions.find((item: any) => {
      return item?.code === src?.code;
    });
    if (!cryptoSelected) return;
    setState((draft) => {
      draft.cryptoSelected = cryptoSelected;
    });
  };

  // 法币金额
  const _onChangeCurrencyAmount = (value: string) => {
    setState((draft) => {
      draft.currencyAmount = value;
    });
  };

  // 数字货币金额
  const _onChangeCoinAmount = (value: string) => {
    setState((draft) => {
      draft.coinAmount = value;
    });
  };

  // 获取币种数据
  const _getCryptoData = async () => {
    const result = await Account.fiatCrypto.getSupports();
    const { quotas, target, source }: any = result?.data || {};
    const currencyOptions = (source || [])
      .map((v: string) => ({
        code: v,
        currency: v,
      }))
      .sort((a: { code: string }) => (a.code === 'USD' ? -1 : 1));

    const cryptoOptions = (target || []).map((v: string) => ({
      code: v,
      currency: v,
    }));

    const defualtCurrency = _getDefaultCurrencyIndex(currencyOptions);
    if (defualtCurrency) {
      setState((draft) => {
        draft.currencySelected = defualtCurrency;
      });
    }
    setState((draft) => {
      draft.currencyOptions = currencyOptions;
      draft.cryptoOptions = cryptoOptions;
      draft.currencyQuotas = quotas || [];
    });
  };

  // 获取法币初始值
  const _getDefaultCurrencyIndex = (options: [{ code: string }]) => {
    const currency =
      {
        vi: 'VND',
        id: 'IDR',
        en: 'USD',
        zh: 'HKD',
        ru: 'RUB',
        ko: 'KRW',
        ja: 'JPY',
        pt: 'EUR',
        tr: 'TRY',
        fr: 'EUR',
        es: 'EUR',
      }[locale] || 'USD';
    const item = options.find((v: { code: string }) => v.code === currency);
    return item || false;
  };

  const _onBuy = ({
    code,
    currencyCode,
    cryptoCode,
    amount,
    bankCode,
  }: {
    code: string;
    currencyCode: string;
    cryptoCode: string;
    amount: string;
    bankCode: string;
  }) => {
    if (!Account.isLogin) {
      router.push('/login');
      return;
    }

    // 判断是否KYC
    if (['VND', 'THB', 'IDR'].includes(currencyCode) && !user.identityPhotoValid) {
      _setVal('kycModel', true);
      return;
    }
    const params = [`type=${code}`];
    if (bankCode) {
      params.push(`bankCode=${Account.fiatCrypto.formatBankCode(code, bankCode, currencyCode)}`);
    }

    Account.fiatCrypto
      .renderPayment(params, currencyCode, cryptoCode, amount)
      .then((result: any) => {
        // onBuyFiatCurrency(gtmParams);
        try {
          const h = window.innerHeight;
          const w = window.innerWidth;
          const _w = 800;
          const _h = 600;
          window.open(
            result.redirectURL,
            '',
            `width=${_w},
            height=${_h},
            top=${(h - _h) / 2},
            left=${(w - _w) / 2},
            toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no`
          );
        } catch (e) {
          window.open(result.redirectURL, '_blank');
        }
      })
      .catch((err: any) => {
        message.error(err);
      });
  };

  const _onSell = ({
    code,
    currencyCode,
    cryptoCode,
    amount,
  }: {
    code: string;
    currencyCode: string;
    cryptoCode: string;
    amount: string;
  }) => {
    if (!Account.isLogin) {
      router.push('/login');
      return;
    }
    setState((draft) => {
      draft.sellParams = {
        amount,
        payment: code,
        currency: cryptoCode,
        target: currencyCode,
      };
    });
    if (user.withdrawTime > 0) {
      _setVal('withdrawModel', true);
      return;
    }
    if (user.email === '') {
      _setVal('emailModel', true);
    } else {
      if (!user.bindGoogle && user.pw_w === 0) {
        _setVal('safetyModel', true);
        return;
      }
      if (user.pw_w != 0) {
        _setVal('pwdModel', true);
      } else {
        _setVal('safetyVerificationModel', true);
      }
    }
  };

  const _onSubmit = async () => {
    if (!password) return;
    try {
      const result: { data: any } = await postAccountVerifyPasswordApi({ password });
      const { macth, error, token } = result.data || {};
      if (!macth) return message.error(error);
      setState((draft) => {
        draft.vToken = token;
      });
      _setVal('pwdModel', false);
      _setVal('safetyVerificationModel', true);
    } catch (e) {
      message.error(e);
    }
  };

  const _onDone = async (redirectURL: string, status: boolean | undefined) => {
    _setVal('safetyVerificationModel', false);
    if (redirectURL && status) {
      try {
        const h = window.innerHeight;
        const w = window.innerWidth;
        const _w = 800;
        const _h = 600;
        window.open(
          redirectURL,
          '',
          `width=${_w},
            height=${_h},
            top=${(h - _h) / 2},
            left=${(w - _w) / 2},
            toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no`
        );
      } catch (e) {
        window.open(redirectURL, '_blank');
      }
    }
  };

  const _onInputNewPwd = (value: string, hasError: boolean = false) => {
    setState((draft) => {
      draft.password = value;
      draft.hasError = hasError;
    });
  };

  const _setVal = <K extends keyof IState>(key: K, value?: IState[K]) => {
    setState((draft: Draft<IState>) => {
      draft[key] = value!;
    });
  };
  const _onCloseIdVerificationModal = () => {
    setState((draft) => {
      draft.showIdVerificationModal = false;
    });
  };

  const _setPayModal = (open: boolean) => {
    setState((draft) => {
      draft.payModal = open;
    });
  };

  // 选择金额
  const _setAmountIndex = (index: number) => {
    setState((draft) => {
      draft.amountIndex = index;
    });
  };

  // 选择银行
  const _setBankIndex = (index: number) => {
    setState((draft) => {
      draft.bankIndex = index;
    });
  };

  // 选择支付渠道
  const _setKey = (index: number) => {
    setState((draft) => {
      draft.key = index;
    });
  };

  const _goToBindEmail = () => {
    router.replace('/account/dashboard?type=security-setting&option=bind-email');
  };

  const _onQuery = () => {
    if (!Account.isLogin) {
      router.push('/login');
      return;
    }
    if (payData.quotaMin && amount < payData.quotaMin) {
      return message.error(
        isBuy
          ? LANG('下单金额不小于{money}', { money: payData.quotaMin })
          : LANG('下单数量不小于{money}', { money: payData.quotaMin })
      );
    } else if (payData.quotaMax && amount > payData.quotaMax) {
      return message.error(
        isBuy
          ? LANG('下单金额不大于{money}', { money: payData.quotaMax })
          : LANG('下单数量不大于{money}', { money: payData.quotaMax })
      );
    }
    if (isBuy) {
      _onBuy({
        code: d_code,
        currencyCode,
        cryptoCode,
        amount,
        bankCode: isBank ? getBankOptions(currencyCode)[bankIndex].code : undefined,
      });
    } else {
      _onSell({
        code: d_code,
        currencyCode,
        cryptoCode,
        amount,
      });
    }
  };

  return {
    state,
    setState,
    setAmountIndex: _setAmountIndex,
    setBankIndex: _setBankIndex,
    setKey: _setKey,
    getValue,
    onChangeCurrency: _onChangeCurrency,
    onChangeCrypto: _onChangeCrypto,
    onChangeCurrencyAmount: _onChangeCurrencyAmount,
    onChangeCoinAmount: _onChangeCoinAmount,
    onRefresh: _onRefresh,
    setType: _setType,
    setPayModal: _setPayModal,
    setVal: _setVal,
    onDone: _onDone,
    onInputNewPwd: _onInputNewPwd,
    onCloseIdVerificationModal: _onCloseIdVerificationModal,
    onSubmit: _onSubmit,
    onBuy: _onBuy,
    onSell: _onSell,
    onQuery: _onQuery,
    goToBindEmail: _goToBindEmail,
  };
};

export default State;
