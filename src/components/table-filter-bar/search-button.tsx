import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';
import { Button } from '../button';

export const SearchButton = ({ onSearchClick }: { onSearchClick: () => void }) => {
  return (
    <Button className={'search-button'} width={80} onClick={onSearchClick}>
      {LANG('查询')}
      <style jsx>{styles}</style>
    </Button>
  );
};
const styles = css`
  :global(.search-button) {
    color: var(--text_brand)!important;
  }
`;
