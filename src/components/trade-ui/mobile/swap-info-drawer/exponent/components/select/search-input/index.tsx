import { clsx } from '@/core/utils';
import Image from 'next/image';
import { useState } from 'react';
import css from 'styled-jsx/css';

const SearchInput = ({ onChange, value, setVisible }: any) => {
  const [isFocus, setFocus] = useState(false);
  const _focus = () => {
    setFocus(true);
    setVisible(true);
  };
  const _blur = () => {
    setFocus(true);
    setVisible(false);
  };

  return (
    <div className={clsx('search-input', isFocus && 'focus')}>
      <Image src="/static/images/account/security-setting/search.svg" className="icon" alt="" width="16" height="16" />
      <input value={value} onChange={e => onChange(e.target.value)} onFocus={_focus} onBlur={_blur} />
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .search-input {
    border-radius: 4px;
    border: 1px solid var(--theme-border-color-1);
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 10px;
    background: var(--fill-pop);
    box-shadow: 0px 0px 8px 0px var(--fill-projection);
    border-radius: 8px 8px 0 0;

    &:hover {
      border-radius: 0;
      border-color: var(--skin-primary-color);
    }
    &.focus {
      // border-radius: 0;
    }
    :global(.icon) {
      user-select: none;
      width: 16px;
      height: 16px;
    }
    :global(input) {
      padding-left: 10px;
      font-size: 16px;
      width: 4rem;
      height: 2rem;
      border: none;
      flex: 1;
      background: var(--fill-pop);
      color: var(--text-primary);
    }
  }
`;

export default SearchInput;
