import { SwapTradeItem, TradeMap } from '@/core/shared';
import { useEffect, useState } from 'react';

export const useFormatCryptoName = () => {
  const [swapCryptos, setSwapCryptos] = useState<any>(new Map<string, SwapTradeItem>());
  const [symbol, setSymbol] = useState<string>('');

  const getFormattedSwapCryptoName = async () => {
    const swapData = await TradeMap.getSwapTradeMap();
    swapData && setSwapCryptos(swapData);
  };

  useEffect(() => {
    getFormattedSwapCryptoName();
  }, []);

  const formatSwapCryptoName = (cryptoCode: string) => {
    const crypto = swapCryptos.get(cryptoCode.toUpperCase());
    const name = crypto?.name || '';
    if (symbol != name) {
      setSymbol(name);
    }
    return name;
  };

  return { symbol, formatSwapCryptoName };
};
