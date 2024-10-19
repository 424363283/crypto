import { operator } from '@/service';
import { useEffect, useRef, useState } from 'react';

type PriceRecord = Record<string, string>;

export function useFuturePrices() {
  const markedPricesTemp = useRef<PriceRecord>({});
  const [markedPrices, setMarkedPrices] = useState<PriceRecord>({});

  const lastPricesTemp = useRef<PriceRecord>({});
  const [lastPrices, setLastPrices] = useState<PriceRecord>({});

  useEffect(() => {
    const indicesHandler = (data: any) => {
      const tempMarkedPrices: Record<string, string> = { ...markedPricesTemp.current };
      data.forEach((item: any) => {
        tempMarkedPrices[item.symbol] = item.index;
      });
      markedPricesTemp.current = tempMarkedPrices;
      setMarkedPrices(tempMarkedPrices);
    };
    operator.subscribe('indices_source', indicesHandler);

    const quoteHandler = (data: any) => {
      const tempLastPrices: PriceRecord = { ...lastPricesTemp.current };
      data.forEach((item: any) => {
        tempLastPrices[item.s] = item.c;
      });
      lastPricesTemp.current = tempLastPrices;
      setLastPrices(tempLastPrices);
    };
    operator.subscribe('symbol_quote_source', quoteHandler);
    return () => {
      operator.unsubscribe('indices_source', indicesHandler);
      operator.unsubscribe('symbol_quote_source', quoteHandler);
    };
  }, []);

  return {
    /** 最新价 */
    lastPrices,
    /** 标记价 */
    markedPrices
  };
}
