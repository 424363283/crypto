import { BasicInput, INPUT_TYPE } from '@/components/basic-input';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import React, { memo, useState } from 'react';
import css from 'styled-jsx/css';
import CommonIcon from '../common-icon';

interface Props {
  onChange: (value: string) => void;
  value?: string;
  prefix?: boolean;
  placeholder?: string;
  width?: number;
}

const SearchInput: React.FC<Props> = ({ onChange, value, prefix = true, placeholder, width = 250 }) => {
  const [focus, setFocus] = useState(false);
  const [val, setVal] = useState(value);

  const handleInputChange = (val: string) => {
    if (!value) {
      setVal(val);
    }
    onChange(val);
  };

  const inputClassNames = clsx('search-input', focus && 'focus');

  return (
    <div className={clsx(inputClassNames, prefix && 'prefix-search-input')} style={{ width: width }}>
      <BasicInput
        className={clsx('basic-search-input')}
        prefix={prefix && <CommonIcon name='common-search-0' size={16} className='prefix-icon' />}
        value={val}
        label=''
        type={INPUT_TYPE.NORMAL_TEXT}
        onInputChange={handleInputChange}
        placeholder={placeholder || LANG('搜索币种')}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />

      <style jsx>{styles}</style>
    </div>
  );
};
export default memo(SearchInput);

const styles = css`
  @import 'src/core/styles/src/design.scss';
  .prefix-search-input {
    :global(.basic-input-box) {
      position: relative;
      :global(.prefix-icon) {
        position: absolute;
        left: 14px;
      }
      :global(input) {
        text-indent: 20px;
        font-size: 12px;
      }
    }
  }
  .search-input {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 250px;
    height: 30px;
    border-radius: 8px;
    overflow: hidden;
    :global(.basic-search-input) {
      flex: 1;
      border: 0;

      label {
        left: 0;
      }
    }
    .icon {
      width: 16px;
      height: 16px;
    }
  }
`;
