import { useFutureOrderStore } from '@/store/future-order';
import { EntrustPriceTypes, PriceTypes } from '@/utils/futures';

// 动画定时器
let priceAnimateTimer: any = -1;
/**
 * 
 * 设置下单价格
 */
export function useSetFutureorderPrice() {
  const { priceType, currentEntrustPriceType, updateFutureOrderStore } = useFutureOrderStore();
  return {
    setPrice: (price: string) => {
      clearTimeout(priceAnimateTimer);
      if (
        priceType != PriceTypes.MARKET_PRICE &&
        (priceType != PriceTypes.PLAN ||
          (priceType == PriceTypes.PLAN && currentEntrustPriceType == EntrustPriceTypes.LIMIT))
      ) {
        updateFutureOrderStore({ price, priceFrom: 'handicap' });
        priceAnimateTimer = setTimeout(() => {
          updateFutureOrderStore({ priceFrom: '' });
        }, 200);
      }
    }
  };
}
