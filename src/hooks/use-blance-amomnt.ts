import { useFutureStore, usePositionStore } from '@/store';
import { useFutureOrderStore } from '@/store/future-order';
import { substrDigit } from '@/utils';
export function useBalanceAmomnt() {
  const { futureBalances } = useFutureStore();
  const { crossUnrealisedPnl } = usePositionStore();
  const { positionType } = useFutureOrderStore();
  const assets = futureBalances.filter(item => 'USDT' == item.tokenName);
  const amount = assets[0]?.availableMargin;
  const fullPositionBalances =
    futureBalances && (Number(amount) + Number(crossUnrealisedPnl) + Number(futureBalances[0]?.indebted)).toString();

  const crossUnrealisedPnlVal = Number(crossUnrealisedPnl) > 0 ? 0 : Number(crossUnrealisedPnl);

  const ByPositionBalances =
    futureBalances && (Number(amount) + Number(crossUnrealisedPnlVal) + Number(futureBalances[0]?.indebted)).toString();

  const availableMargin = positionType === 2 ? fullPositionBalances : ByPositionBalances;

  return {
    availableMargin: substrDigit(availableMargin.toString(), 4)
  };
}
