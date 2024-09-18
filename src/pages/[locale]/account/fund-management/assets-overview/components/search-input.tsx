import { BasicInput, INPUT_TYPE } from '@/components/basic-input';
import CommonIcon from '@/components/common-icon';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import React, { useState } from 'react';
import css from 'styled-jsx/css';

interface Props {
  onChange: (value: string) => void;
  value?: string;
}

const SearchInput: React.FC<Props> = ({ onChange, value }) => {
  const [focus, setFocus] = useState(false);
  const [val, setVal] = useState(value);

  const handleInputChange = (value: string) => {
    setVal(value);
    onChange(value);
  };

  const inputClassNames = clsx('pc-v2-input', 'search-input', focus && 'focus');

  return (
    <div className={inputClassNames}>
      <BasicInput
        className='input'
        value={val}
        label=''
        type={INPUT_TYPE.NORMAL_TEXT}
        onInputChange={handleInputChange}
        placeholder={LANG('搜索币种')}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        suffix={<CommonIcon size={16} className='icon' name='common-search-0' />}
      />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .search-input {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 310px;
    height: 36px;
    background-color: var(--theme-sub-button-bg);
    border-radius: 4px;
    overflow: hidden;
    .input {
      flex: 1;
      border: 0;
      input {
        height: 100%;
        text-indent: 0;
      }
      label {
        left: 0;
      }
    }
  }
`;
export default SearchInput;
