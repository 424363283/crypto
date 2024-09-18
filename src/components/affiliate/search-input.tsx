import { LANG } from '@/core/i18n';
import { MediaInfo } from '@/core/utils';
import { ChangeEvent } from 'react';
import css from 'styled-jsx/css';

interface Props {
  value: string;
  onChange: (val: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

const AffiliateSearchInput = ({ value, onChange, placeholder, onSearch }: Props) => {
  const _onChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e.currentTarget.value);
  };

  return (
    <>
      <div className={`container`}>
        <input type='text' onChange={_onChange} value={value} placeholder={placeholder} />
        <span onClick={onSearch}>{LANG('搜索')}</span>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default AffiliateSearchInput;

const styles = css`
  .container {
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px;
    padding: 0 9px;
    border: 1px solid var(--theme-border-color-2);
    width: 260px;
    @media ${MediaInfo.mobile} {
      width: 100%;
    }
    input {
      flex: 1;
      color: var(--theme-font-color-1);
      border: none;
      background-color: inherit;
      &::placeholder {
        color: var(--theme-font-color-3);
      }
    }
    span {
      color: var(--skin-primary-color);
      cursor: pointer;
    }
  }
`;
