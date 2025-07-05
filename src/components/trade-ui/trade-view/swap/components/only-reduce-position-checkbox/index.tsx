import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';
import { CheckboxItem } from '../checkbox-item';
import { ORDER_TRADE_TYPE } from '@/core/shared/src/swap/modules/trade/constants';
import { useEffect } from 'react';

export const OnlyReducePositionCheckbox = () => {
  const onlyReducePosition = Swap.Trade.store.onlyReducePosition;
  const twoWayMode = Swap.Trade.twoWayMode;
  const orderTradeType = Swap.Trade.store.orderTradeType;
  const isMarketOrder = orderTradeType === ORDER_TRADE_TYPE.MARKET;
  useEffect(() => {
    return () => {
      Swap.Trade.onChangeOnlyReducePosition(false);
    }
  }, [orderTradeType]);

  if (twoWayMode || isMarketOrder) return <></>;

  return (
    <>
      <CheckboxItem
        label={LANG('只减仓')}
        info={LANG('只减仓订单只会减少您的仓位，而不会增加仓位。')}
        value={onlyReducePosition}
        radioAttrs={{ width: 16, height: 16 }}
        onChange={(v) => Swap.Trade.onChangeOnlyReducePosition(v)}
        className={clsx('only-reduce-position')}
      />
      {styles}
    </>
  );
};

const { className, styles } = css.resolve`
  .only-reduce-position {
    margin-bottom: 0px;
  }
`;
const clsx = clsxWithScope(className);
