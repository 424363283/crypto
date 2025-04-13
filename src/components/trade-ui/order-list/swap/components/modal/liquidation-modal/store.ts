import { Loading } from '@/components/loading';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { resso } from '@/core/store';
import { formatNumber2Ceil, message } from '@/core/utils';
import { useEffect } from 'react';

export const store = resso<{ inputPrice: string; inputVolume: string; income: string; optionIndex: null | number }>({
  inputPrice: '', // 输入价格
  inputVolume: '', // 输入数量
  income: '',
  optionIndex: null
});
export const handleStore = ({ data, isUsdtType, isLimit, onClose }: any) => {
  const isVolUnit = Swap.Info.getIsVolUnit(isUsdtType);
  const volumeDigit = Swap.Info.getVolumeDigit(data?.symbol);
  const { minDelegateNum } = Swap.Info.getCryptoData(data?.symbol);

  const getMarketPrice = () => Swap.Socket.getFlagPrice(data?.symbol, { withHooks: false });

  const onCalculateIncome = () => {
    const scale = isUsdtType ? 2 : Number(data.basePrecision);
    const inputVolume = store.getSnapshot('inputVolume');
    let value: any = inputVolume;
    if (!inputVolume || !data.symbol) {
      store.income = (0).toFixed(scale);
      return;
    }
    if (isUsdtType ? true : !isVolUnit) {
      value = Swap.Calculate.amountToVolume({
        usdt: isUsdtType,
        value,
        code: data.symbol
      });
    }

    let income = Swap.Calculate.income({
      usdt: isUsdtType,
      code: data.symbol,
      isBuy: data.side === '1',
      flagPrice: isLimit ? store.getSnapshot('inputPrice') : getMarketPrice(),
      avgCostPrice: Number(data.avgCostPrice),
      volume: value || 0
    });

    income = formatNumber2Ceil(income, scale, false);
    store.income = income?.toFixed(scale);
  };
  const onChangePrice = (e: any) => {
    store.inputPrice = e;
    onCalculateIncome();
  };

  const onChangeVolume = (e: any, index: any) => {
    const max = Number(formatPositionNumber(data?.availPosition));
    if (e * 1 > max) {
      e = max;
    }
    store.inputVolume = e;
    store.optionIndex = index;
    onCalculateIncome();
  };

  const formatPositionNumber = (num?: any, fixed?: any, flagPrice?: any) => {
    return data
      ? Swap.Calculate.formatPositionNumber({
          usdt: isUsdtType,
          code: data.symbol,
          value: num || 0,
          fixed: fixed || volumeDigit,
          flagPrice
        })
      : 0;
  };

  const getMinOrderVolume = () => {
    const inputPrice = store.getSnapshot('inputPrice');
    const isMarketType = !isLimit;
    const orderPrice = (isMarketType ? getMarketPrice() : inputPrice) || 0;
    const minOrderVol = formatPositionNumber(minDelegateNum, volumeDigit, orderPrice);

    return minOrderVol;
  };

  const onConfirm = async () => {
    const inputPrice = store.getSnapshot('inputPrice');
    const inputVolume = store.getSnapshot('inputVolume');
    const optionIndex = store.getSnapshot('optionIndex');
    // 计算 张和币的转化
    let value = inputVolume;
    if (optionIndex === 4) {
      // 100% 等于仓位数量
      value = Number(data.availPosition);
    } else if (isUsdtType ? true : !isVolUnit) {
      value = Swap.Calculate.amountToVolume({
        usdt: isUsdtType,
        value,
        code: data.symbol
      });
    }

    if (isUsdtType && value <= 0) {
      return message.error(
        LANG('下单数量最少为{volume}', {
          volume: `${getMinOrderVolume()} ${Swap.Info.getUnitText({ symbol: data?.symbol })}`
        }),
        1
      );
    }

    Loading.start();
    try {
      const result = await Swap.Order.closePosition(data, {
        price: isLimit ? Number(inputPrice) : '',
        orderQty: value,
        side: Number(data.side) === 1 ? 1 : 2, // 1 买  2 卖
        type: !isLimit ? 5 : 4
      });
      if (result.code == 200) {
        Swap.Assets.fetchBalance(isUsdtType);
        Swap.Order.fetchPosition(isUsdtType);
        onClose();
      } else {
        // 重复提示 Swap.Order.closePosition
        // message.error(result);
      }
    } catch (error: any) {
      message.error(error);
    } finally {
      Loading.end();
    }
  };
  useEffect(() => {
    onCalculateIncome();
  }, [isLimit]);

  return {
    isVolUnit,
    onCalculateIncome,
    onChangePrice,
    onChangeVolume,
    formatPositionNumber,
    volumeDigit,
    getMarketPrice,
    getMinOrderVolume,
    onConfirm
  };
};

export const setInputPrice = (e: any) => {
  store.inputPrice = e;
};

export const setInputVolume = (e: any) => {
  store.inputVolume = e;
};

export const submitClosePosition = async ({ isUsdtType, isLimit, value, data, inputPrice }: any) => {
  // 计算 张和币的转化
  const getMarketPrice = () => Swap.Socket.getFlagPrice(data?.symbol, { withHooks: false });
  const isVolUnit = Swap.Info.getIsVolUnit(isUsdtType);
  if (isUsdtType && value <= 0) {
    const isMarketType = !isLimit;
    const orderPrice = (isMarketType ? data.avgCostPrice : data.avgCostPrice) || 0;
    const { minDelegateNum } = Swap.Info.getCryptoData(data?.symbol);
    const volumeDigit = Swap.Info.getVolumeDigit(data?.symbol);
    const minOrderVol = data
      ? Swap.Calculate.formatPositionNumber({
          usdt: isUsdtType,
          code: data.symbol,
          value: minDelegateNum,
          fixed: volumeDigit,
          flagPrice: orderPrice
        })
      : 0;
    return message.error(
      LANG('下单数量最少为{volume}', {
        volume: `${minOrderVol} ${Swap.Info.getUnitText({ symbol: data?.symbol })}`
      }),
      1
    );
  }

  if (isUsdtType ? true : !isVolUnit) {
    value = Swap.Calculate.amountToVolume({
      usdt: isUsdtType,
      value,
      code: data.symbol,
      flagPrice: data.avgCostPrice,
      shouldCeil: true
    });
  }
  /* 
  
    VOL: 'vol',
    COIN: 'coin',
    MARGIN: 'margin',
  */

  Loading.start();
  try {
    const result = await Swap.Order.closePosition(data, {
      price: isLimit ? Number(inputPrice) : '',
      orderQty: value,
      side: Number(data.side) === 1 ? 1 : 2, // 1 买  2 卖
      type: !isLimit ? 5 : 4
      // type: isLimit ? 5 : 4,
    });
    const volumeDigit = Swap.Info.getVolumeDigit(data?.symbol);
    if (result.code == 200) {
      Swap.Assets.fetchBalance(isUsdtType);
      Swap.Order.fetchPosition(isUsdtType);
    } else if (result.code === 100008) {
      let min = result.data[0];
      let max = result.data[1];
      let errMsg = '';
      if (Swap.Info.getUnitMode(isUsdtType) === 'coin') {
        min = Swap.Calculate.volumeToAmount({
          usdt: isUsdtType,
          value: min,
          code: data.symbol,
          fixed: volumeDigit
        });
        max = Swap.Calculate.volumeToAmount({
          usdt: isUsdtType,
          value: max,
          code: data.symbol,
          fixed: volumeDigit
        });
        const coin = data.symbol.split('-')[0].toUpperCase();
        errMsg = LANG('下单张数范围最低{min}{coin},最高{max}{coin}', {
          min,
          max,
          coin
        });
      } else {
        min = Number(
          Swap.Calculate.formatPositionNumber({
            usdt: isUsdtType,
            code: data.symbol,
            value: min,
            fixed: volumeDigit,
            flagPrice: data.avgCostPrice
          })
        );
        max = Number(
          Swap.Calculate.formatPositionNumber({
            usdt: isUsdtType,
            value: max,
            code: data.symbol,
            fixed: volumeDigit,
            flagPrice: data.avgCostPrice
          })
        );
        if (Swap.Info.getUnitMode(isUsdtType) === 'margin') {
          errMsg = LANG('下单保证金范围最低{min}USDT,最高{max}USDT', {
            min,
            max
          });
        } else {
          errMsg = LANG('下单USDT范围最低{min}USDT,最高{max}USDT', {
            min,
            max
          });
        }
      }
      // 重复提示 Swap.Order.closePosition
      message.error(errMsg);
    }
  } catch (error: any) {
    message.error(error);
  } finally {
    Loading.end();
  }
};
