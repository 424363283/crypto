import { useRouter } from '@/core/hooks';
import { TradeMap } from '@/core/shared';
import { isLite, isSpot, isSwap } from '@/core/utils';
import { useEffect, useState } from 'react';

export const useOnlineByRouteId = () => useOnlineById(useRouter().query.id);
export const useOnlineById = (id?: string) => {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleState = async () => {
      if (id) {
        const func = [(id: string) => TradeMap.getSpotById(id), (id: string) => TradeMap.getLiteById(id), (id: string) => TradeMap.getSwapById(id)];
        const funcIndex = [isSpot(id), isLite(id), isSwap(id)].findIndex((v) => v);
        const item = await func[funcIndex](id);
        const onlineTime = item?.onlineTime || 0;
        const duration = onlineTime - new Date().getTime();
        const isOnline = duration < 0;
        setOnline(isOnline);
        if (!isOnline) {
          timer = setTimeout(() => {
            handleState();
          }, duration);
        }
      }
    };
    handleState();

    return () => clearTimeout(timer);
  }, [id]);

  return online;
};
