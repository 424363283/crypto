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
  const options = [LANG('限价丨市价'), LANG('计划委托'), LANG('止盈止损')];
  const values = [ORDER_TYPES.LIMIT, ORDER_TYPES.SPSL, ORDER_TYPES.SP_OR_SL, ORDER_TYPES.TRACK];
  return (
    <>
      <div className='order-type-select'>
        {options.map((v, i) => {
          const active = values.findIndex((v) => v === value) === i;
          return (
            <div key={i} onClick={() => onChange(values[i])} className={clsx(active && 'active', values[i] === ORDER_TYPES.SPSL && 'hidden')}>
              {v}
              {listLength[i] ? `(${listLength[i]})` : ''}
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .order-type-select {
          display: flex;
          padding: 16px 24px;
          align-items: center;
          gap: 16px;
          width:100%;
          > div {
            cursor: pointer;
            color: var(--text-secondary);
            font-size: 12px;
            font-weight: 400;
            user-select: none;
            display: flex;
            padding: 8px 16px;
            align-items: center;
            gap: 10px;
            border-radius: 6px;
            border: 1px solid var(--line-3);
            height: 30px;
            &.active {
              border: 1px solid var(--fill-3);
              background: var(--fill-3);
            }
          }
        }
      `}</style>
    </>
  );
};
