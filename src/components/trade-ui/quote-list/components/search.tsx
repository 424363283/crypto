import { BasicInput, INPUT_TYPE } from '@/components/basic-input';
import CommonIcon from '@/components/common-icon';
import { Size } from '@/components/constants';
import { Svg } from '@/components/svg';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import React, { FocusEventHandler, useEffect, useState } from 'react';

const QuoteSearch = ({
  onChange,
  value: propValue,
  onFocus,
  onBlur
}: {
  onChange?: Function;
  value?: any;
  onFocus?: FocusEventHandler<HTMLInputElement> | undefined;
  onBlur?: FocusEventHandler<HTMLInputElement> | undefined;
}) => {
  const [_value, setValue] = useState<string>('');
  const value = propValue === undefined ? _value : propValue;
  const { isDark } = useTheme();

  useEffect(() => {
    if (propValue != undefined) setValue(propValue);
  }, [propValue]);
  return (
    <>
      <div className="search-wrap">
        <BasicInput
          label={''}
          onBlur={onBlur}
          onFocus={onFocus}
          type={INPUT_TYPE.NORMAL_TEXT}
          placeholder={LANG('搜索币种')}
          value={value}
          size={Size.SM}
          rounded
          clearable={true}
          prefix={<CommonIcon size={16} className="prefix-icon" name="common-search-0" />}
          onInputChange={(val: string) => {
            // if (/^[A-Za-z0-9]*$/.test(val)) {
            setValue(val.toUpperCase());
            onChange?.(val.toUpperCase());
            // }
          }}
        />
      </div>
      <style jsx>{`
        .search-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          :global(.basic-input-box) {
            background: var(--fill_3);
          }
        }
        @media ${MediaInfo.mobile} {
          .search-wrap {
            margin: 0;
            margin-top: 1.5rem;
            margin-bottom: 1rem;
            :global(.basic-input-box) {
              background: var(--fill_input_1);
              &:hover {
                background: var(--fill_1);
              }
            }
          }
        }
      `}</style>
    </>
  );
};

export default React.memo(QuoteSearch);
