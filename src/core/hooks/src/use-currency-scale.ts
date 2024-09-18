import { SpotCurrency } from '@/core/shared';
import { useEffect, useState } from 'react';

export const useCurrencyScale = (currency: string) => {
  const [scale, setScale] = useState<number>(2);

  // 默认行为
  useEffect(() => {
    if (currency) getScale(currency);
  }, [currency]);

  const getScale = async (currency: string) => {
    const scale = await SpotCurrency.getScale(currency);
    setScale(scale);
  };

  return {
    scale,
    changeCurrency: getScale,
  };
};
