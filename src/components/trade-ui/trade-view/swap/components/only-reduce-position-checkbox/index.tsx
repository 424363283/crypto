import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';
import { CheckboxItem } from '../checkbox-item';

export const OnlyReducePositionCheckbox = () => {
  const onlyReducePosition = Swap.Trade.store.onlyReducePosition;
  const twoWayMode = Swap.Trade.twoWayMode;

  if (twoWayMode) {
    return <div style={{ height: 10 }} />;
  }
  return (
    <>
      <CheckboxItem
        label={LANG('只减仓')}
        info={LANG('只减仓订单只会减少您的仓位，而不会增加仓位。')}
        value={onlyReducePosition}
        onChange={(v) => Swap.Trade.onChangeOnlyReducePosition(v)}
        className={clsx('only-reduce-position')}
      />
      {styles}
    </>
  );
};

const { className, styles } = css.resolve`
  .only-reduce-position {
    margin-bottom: 10px;
  }
`;
const clsx = clsxWithScope(className);
