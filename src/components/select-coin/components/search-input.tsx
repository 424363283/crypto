import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import Image from 'next/image';
import { useState } from 'react';
import css from 'styled-jsx/css';

const SearchInput = ({ onChange, value }: { onChange: (value: string) => void; value: string }) => {
  const [isFocus, setFocus] = useState(false);
  const _focus = () => {
    setFocus(true);
  };
  const _blur = () => {
    setFocus(false);
  };
  return (
    <div className={clsx('search-input', isFocus && 'focus')}>
      <Image className='icon' src='/static/images/account/security-setting/search.svg' alt='' width='14' height='14' />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={LANG('搜索币种')}
        onFocus={_focus}
        onBlur={_blur}
      />
      <style jsx>{styles}</style>
    </div>
  );
};

export default SearchInput;
const styles = css`
  .search-input {
    width: 100%;
    height: 32px;
    border-radius: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 10px;
    background-color: var(--fill-3);
    .icon {
      user-select: none;
      width: 16px;
      height: 16px;
    }
    input {
      background-color: var(--fill-3);
      padding-left: 10px;
      flex: 1;
      font-size: 14px;
      border: 0;
      outline: none;
      width: 0;
      color: var(--text-primary);
    }
  }
`;
