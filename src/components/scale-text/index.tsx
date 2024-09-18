import { useCurrencyScale } from '@/core/hooks';
import { useEffect } from 'react';

interface ScaleTextProps {
  money: number | string; // 钱
  currency: string; // 钱的货币单位
}

export const ScaleText = ({ money, currency }: ScaleTextProps) => {
  const { scale, changeCurrency } = useCurrencyScale(currency);

  useEffect(() => {
    changeCurrency(currency);
  }, [currency]);

  return <>{money?.toFixed(scale)}</>;
};
