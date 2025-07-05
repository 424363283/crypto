import { LiteTradeItem, TradeMap } from '@/core/shared';
import { useCallback, useEffect, useState } from 'react';

export const useLiteDeferState = () => {
  const [liteMap, setLiteMap] = useState<Map<string, LiteTradeItem>>();

  useEffect(() => {
    TradeMap.getLiteTradeMap().then(async list => {
      setLiteMap(list);
    });
  }, []);

  const showDeferStatus = useCallback(() => {
    if (!liteMap) return false;
    for (let [key, value] of liteMap) {
      if (value.defer) {
        return true;
      }
    }
    return false;
  }, [liteMap]);

  return { liteMap, showDeferStatus };
};
