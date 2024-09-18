import css from 'styled-jsx/css';
import CommonIcon from '../common-icon';

export const BlockUrl = ({ url = '--', onBlockUrlClick }: { url: string; onBlockUrlClick: () => void }) => {
  return (
    <div onClick={onBlockUrlClick} className='block-url'>
      <span style={{ color: 'var(--skin-primary-color)' }}>{url}</span>
      <CommonIcon name='common-query-icon-0' className='search-icon' size={16} enableSkin />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .block-url {
    display: flex;
    align-items: center;
    :global(.search-icon) {
      margin-left: 10px;
      cursor: pointer;
    }
  }
`;
