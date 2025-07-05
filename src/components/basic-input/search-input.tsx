import { BasicInput, INPUT_TYPE } from '@/components/basic-input';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import React, { memo, useState } from 'react';
import CommonIcon from '../common-icon';
import { Size } from '../constants';
import { useResponsive } from '@/core/hooks';
import css from 'styled-jsx/css';

interface Props {
  onChange: (value: string) => void;
  value?: string;
  prefix?: boolean;
  placeholder?: string;
  width?: number | string;
  prefixICon?: any;
  size: Size;
}

const SearchInput: React.FC<Props> = ({ onChange, value, prefix = true, prefixICon, placeholder, width = 250, size = Size.SM }) => {
  const [focus, setFocus] = useState(false);
  const [val, setVal] = useState(value);
  const { isMobile } = useResponsive();

  const handleInputChange = (val: string) => {
    if (!value) {
      setVal(val);
    }
    onChange(val);
  };

  return (
    <div className={clsx('search-input')} style={{ width: width }}>
      <BasicInput
        className={clsx('basic-search-input')}
        prefix={
          prefix ? (
            prefixICon ? (
              prefixICon
            ) : (
              <CommonIcon name="common-search-0" size={isMobile ? 14 : 20} className="prefix-icon" />
            )
          ) : (
            ''
          )
        }
        value={val}
        label=""
        rounded
        size={size}
        type={INPUT_TYPE.NORMAL_TEXT}
        onInputChange={handleInputChange}
        placeholder={placeholder || LANG('搜索币种')}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        clearable={true}
      />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .search-input {
    :global(.basic-input-box) {
      padding: 0 24px;
      :global(input) {
        padding: 0 !important;
      }
      :global(.nui-addon), .nui-button, .nui-spinner, .nui-icon, .nui-tag {
        &:first-child:not(input) {
          margin-left: 0px !important;
          margin-right: 8px !important;
        }
        &:last-child {
          margin-left: 8px !important;
          margin-right: 0 !important;
        }
      }
    }
  }
`;
export default memo(SearchInput);
