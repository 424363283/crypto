import { Rate } from '@/core/shared';
import { useEffect, useMemo, useRef, useState } from 'react';

export interface RateTextProps {
  money?: number | string; // 钱
  currency?: string; // 钱的货币单位
  exchangeRateCurrency?: string; // 汇率
  prefix?: boolean; // 前缀
  suffix?: boolean; // 后缀
  showCurrencySymbol?: boolean; // 是否格式化 ，显示local currency而不是代币符号,eg: USD,HKD
  onlySymbol?: boolean; // 只显示符号,eg:$, $,￥
  useFormat?: boolean; // 是否使用千分位格式化，showCurrencySymbol为true时有效
  scale?: number; // 精度
  toCurrency?: string; // 目标货币。将USDT转为目标货币，例如：100 USDT 兑换 0.0038 BTC
  formatWithScale?: boolean; // 只做精度格式化
}
/**
 *
 * @param props RateTextProps
 * @description 根据local currency汇率转换钱的显示
 * @returns {JSX.Element}
 */
export const useRate = (props?: RateTextProps) => {
  const memoizedProps = useMemo(() => props, [props]);

  const { money = 0, currency, exchangeRateCurrency, formatWithScale = false, prefix, suffix, showCurrencySymbol = false, onlySymbol = false, useFormat = false, scale, toCurrency } = memoizedProps || {};
  const [text, setRate] = useState<string>('--');
  const ref = useRef<Rate>();
  const { currency: unit } = Rate.store;

  useEffect(() => {
    (async () => {
      if (!ref.current) {
        ref.current = await Rate.getInstance();
      }
      const rateValue = { money, currency: currency, exchangeRateCurrency, scale };
      if (toCurrency) {
        const value = ref?.current?.toRateUnitByEqualValue({ money, toCurrency, scale });
        setRate(value);
        return;
      }
      if (formatWithScale) {
        const value = ref?.current?.formatMoneyByScale({ money, useScale: true, currency });
        setRate(String(value));
        return;
      }
      if (showCurrencySymbol) {
        const value = ref?.current?.toRate(rateValue);
        if (prefix) {
          setRate(unit + ' ' + value);
          return;
        }
        if (suffix) {
          setRate(value + ' ' + unit);
          return;
        }
        setRate(String(value));
        return;
      }
      if (onlySymbol) {
        setRate(ref?.current?.localSymbol);
        return;
      }
      if (prefix) {
        setRate(ref?.current?.toRateUnit(rateValue));
      } else if (suffix) {
        setRate(ref?.current?.toRateSuffix(rateValue));
      } else {
        setRate(ref?.current?.toRate(rateValue));
      }
    })();
  }, [memoizedProps, unit]);
  const numReg = /[\d.]+/g;
  const pureNumber = text?.match(numReg)?.join('') || '';
  const symbolReg = /[^0-9.]+/g;
  const symbol = text?.match(symbolReg)?.join('') || '';
  const formatValue = prefix ? symbol + pureNumber?.toFormat(scale) : pureNumber?.toFormat(scale) + symbol;
  return {
    text: useFormat ? formatValue : text,
    getValue: (props: RateTextProps) => {
      const { money = 0, currency, exchangeRateCurrency, scale } = props;
      if (!ref?.current) return 0;
      const rateValue = { money, currency, exchangeRateCurrency, scale };
      return ref?.current?.toRate(rateValue);
    },
  };
};
