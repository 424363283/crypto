import { LANG } from '@/core/i18n';
import { clsx } from '../styled';

export const ORDER_TYPES = {
  LIMIT: 'limit',
  SPSL: 'spsl',
  SP_OR_SL: 'sp or sl',
  TRACK: 'track',
};

export const OrderTypeSelect = ({
  value,
  onChange,
  listLength,
}: {
  value: string;
  onChange: (value?: string) => any;
  listLength: any;
}) => {
  const options = [LANG('限价委托'), LANG('止盈止损委托'), LANG('止盈/止损')];
  const values = [ORDER_TYPES.LIMIT, ORDER_TYPES.SPSL, ORDER_TYPES.SP_OR_SL, ORDER_TYPES.TRACK];
  return (
    <>
      <div className='order-type-select'>
        {options.map((v, i) => {
          const active = values.findIndex((v) => v === value) === i;
          return (
            <div key={i} onClick={() => onChange(active ? undefined : values[i])} className={clsx(active && 'active')}>
              {v}
              {listLength[i] ? `(${listLength[i]})` : ''}
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .order-type-select {
          display: flex;
          margin-left: 20px;
          margin-top: 10px;
          > div {
            cursor: pointer;
            font-size: 12px;
            margin-right: 15px;
            color: var(--theme-trade-text-color-3);
            line-height: 17px;
            padding: 8px 0;
            user-select: none;
            &.active {
              font-weight: 500;
              padding: 8px 10px;
              background-color: var(--theme-trade-select-bg-color);
              border-radius: 6px;
              color: var(--theme-trade-text-color-1);
            }
          }
        }
      `}</style>
    </>
  );
};
