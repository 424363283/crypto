import { Swap } from '@/core/shared';
import { useEffect } from 'react';

export const usePageListener = () => {
  useEffect(() => {
    const visibilityChange = () => {
      const isUsdtType = Swap.Trade.base.isUsdtType;

      Swap.Order.fetchPending(isUsdtType);
      Swap.Order.fetchPosition(isUsdtType);
    };
    document.addEventListener('visibilitychange', visibilityChange);
    return () => document.removeEventListener('visibilitychange', visibilityChange);
  }, []);
};
