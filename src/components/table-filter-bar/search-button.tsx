import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';

export const SearchButton = ({ onSearchClick }: { onSearchClick: () => void }) => {
  return (
    <div className={'search-button'} onClick={onSearchClick}>
      {LANG('查询')}
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .search-button {
    background-color: var(--theme-background-color-14);
    cursor: pointer;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    padding: 0px 10px;
    color: var(--skin-color-active);
    vertical-align: middle;
    text-align: center;
    margin-left: 10px;
  }
`;
