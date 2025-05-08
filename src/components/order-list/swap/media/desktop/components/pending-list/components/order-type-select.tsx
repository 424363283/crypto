import { LANG } from '@/core/i18n';
import { clsx } from '../styled';
import { TAB_TYPE } from '@/components/tab-bar';
import { useState } from 'react';

export const ORDER_TYPES = {
  LIMIT: 'limit',
  SPSL: 'spsl',
  SP_OR_SL: 'sp or sl',
  TRACK: 'track',
};

export const ORDER_TYPE_KEYS = {
  [ORDER_TYPES.LIMIT]: 1,
  [ORDER_TYPES.SP_OR_SL]: 2
};

export const OrderTypeSelect = ({
  type = TAB_TYPE.CARD,
  value,
  onChange,
  listLength,
}: {
  type?: TAB_TYPE;
  value: string;
  onChange: (value?: string) => any;
  listLength: any;
}) => {
  const options = [LANG('限价丨市价'), LANG('计划委托'), LANG('止盈止损')];
  const values = [ORDER_TYPES.LIMIT, ORDER_TYPES.SPSL, ORDER_TYPES.SP_OR_SL, ORDER_TYPES.TRACK];
  const [orderType, setOrderType] = useState(value);
  return (
    <>
      <div className={clsx('order-type-select', type)}>
        {options.map((v, i) => {
          const active = values.findIndex((v) => v === orderType) === i;
          return (
            <div
              key={i}
              className={clsx(active && 'active', values[i] === ORDER_TYPES.SPSL && 'hidden')}
              onClick={() => {
                setOrderType(values[i]);
                onChange(values[i]);
              }}
            >
              {v}
              {listLength[i] ? `(${listLength[i]})` : ''}
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .order-type-select {
          display: flex;
          margin: 16px 24px;
          align-items: center;
          width:100%;
          > div {
            cursor: pointer;
            color: var(--text_2);
            font-size: 12px;
            font-weight: 400;
            user-select: none;
            display: flex;
            align-items: center;
            gap: 10px;
            height: 30px;
          }
          &.card {
            gap: 16px;
            > div {
              padding: 8px 16px;
              border-radius: 6px;
              border: 1px solid var(--line-3);
              &.active {
                border: 1px solid var(--fill_3);
                background: var(--fill_3);
              }
            }
          }
          &.line {
            gap: 32px;
            border-bottom: 1px solid var(--fill_line_1);
            > div {
              padding: 8px 0;
              &.active {
                color: var(--text_1);
                border-bottom: 1px solid var(--brand);
              }
            }
          }
        }
      `}</style>
    </>
  );
};
