import {
    getAccountRechargeListApi,
    getAccountWithdrawListApi,
    getTradeConvertCurrencyApi,
    getTransferCurrencyApi,
  } from '@/core/api';
  import { useEffect } from 'react';
  import { useImmer } from 'use-immer';
  
  export const useCoinOperateOptions = () => {
    // 交易-充币-提币-转账-闪兑
    const [operateOptions, setOperateOptions] = useImmer<{
      recharge: string[];
      withdraw: string[];
      transfer: string[];
      convert: string[];
    }>({
      withdraw: [], // 提币
      recharge: [], // 充币
      transfer: [], // 转账
      convert: [], // 闪兑
    });
    const getWithdrawList = async () => {
      const list = await getAccountWithdrawListApi();
      return list.data;
    };
    const getRechargeList = async () => {
      const list = await getAccountRechargeListApi();
      return list.data;
    };
    const getTransferCurrency = async () => {
      const list = await getTransferCurrencyApi();
      return list.data;
    };
    const getConvertCurrency = async () => {
      const list = await getTradeConvertCurrencyApi();
      return list.data;
    };
    useEffect(() => {
      Promise.all([getRechargeList(), getWithdrawList(), getTransferCurrency(), getConvertCurrency()]).then((list) => {
        setOperateOptions((draft) => {
          draft.recharge = list[0];
          draft.withdraw = list[1];
          draft.transfer = list[2];
          draft.convert = list[3];
        });
      });
    }, []);
    return [operateOptions];
  };
  