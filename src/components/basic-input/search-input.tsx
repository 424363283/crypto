import { BasicInput, INPUT_TYPE } from '@/components/basic-input';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import React, { memo, useState } from 'react';
import CommonIcon from '../common-icon';
import { Size } from '../constants';
import { useResponsive } from '@/core/hooks';

interface Props {
  onChange: (value: string) => void;
  value?: string;
  prefix?: boolean;
  placeholder?: string;
  width?: number;
  prefixICon?: any;
}

const SearchInput: React.FC<Props> = ({ onChange, value, prefix = true, prefixICon, placeholder, width = 250 }) => {
  const [focus, setFocus] = useState(false);
  const [val, setVal] = useState(value);
  const { isMobile } = useResponsive();

  const handleInputChange = (val: string) => {
    if (!value) {
      setVal(val);
    }
    onChange(val);
  };

  const inputClassNames = clsx('search-input');

  return (
    <div className={clsx(inputClassNames)} style={{ width: width }}>
      <BasicInput
        className={clsx('basic-search-input')}
        prefix={
          prefix ? (
            prefixICon ? (
              prefixICon
            ) : (
              <CommonIcon name="common-search-0" size={isMobile ? 14 : 16} className="prefix-icon" />
            )
          ) : (
            ''
          )}
        value={val}
        label=""
        rounded
        size={Size.SM}
        type={INPUT_TYPE.NORMAL_TEXT}
        onInputChange={handleInputChange}
        placeholder={placeholder || LANG('搜索币种')}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        clearable={isMobile ? true : false}
      />
    </div>
  );
};
export default memo(SearchInput);
