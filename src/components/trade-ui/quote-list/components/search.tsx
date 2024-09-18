import { Svg } from '@/components/svg';
import { LANG } from '@/core/i18n';
import React, { FocusEventHandler, useEffect, useState } from 'react';

const QuoteSearch = ({
  onChange,
  value: propValue,
  onFocus,
  onBlur,
}: {
  onChange?: Function;
  value?: any;
  onFocus?: FocusEventHandler<HTMLInputElement> | undefined;
  onBlur?: FocusEventHandler<HTMLInputElement> | undefined;
}) => {
  const [_value, setValue] = useState<string>('');
  const value = propValue === undefined ? _value : propValue;

  useEffect(() => {
    if (propValue != undefined) setValue(propValue);
  }, [propValue]);
  return (
    <>
      <div className='search-wrap'>
        <div className='search-input'>
          <Svg src='/static/images/trade/quote/search.svg' width={14} height={14} />
          <input
            onBlur={onBlur}
            onFocus={onFocus}
            type='text'
            placeholder={LANG('搜索币种')}
            value={value}
            onChange={(e) => {
              const val = e.target.value;
              if (/^[A-Za-z0-9]*$/.test(val)) {
                setValue(val.toUpperCase());
                onChange?.(val.toUpperCase());
              }
            }}
          />
        </div>
      </div>
      <style jsx>{`
        .search-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 10px;
          .search-input {
            height: 32px;
            width: 100%;
            display: flex;
            align-items: center;
            padding: 0 10px;
            border-radius: var(--theme-trade-layout-radius);
            background: var(--theme-background-color-3);
            border: 1px solid var(--theme-background-color-3);
            &:hover {
              border: 1px solid var(--skin-color-active);
            }
            &:focus-within {
              border: 1px solid var(--skin-color-active);
            }

            input {
              margin-left: 6px;
              width: 100%;
              background: transparent;
              border: none;
              color: var(--theme-trade-text-color-1);
              outline: none;
              font-size: 12px;
            }
          }
        }
      `}</style>
    </>
  );
};

export default React.memo(QuoteSearch);
