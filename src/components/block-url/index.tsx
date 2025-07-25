import css from 'styled-jsx/css';
import CommonIcon from '../common-icon';

export const BlockUrl = ({ url = '--', onBlockUrlClick }: { url: string; onBlockUrlClick: () => void }) => {
  return (
    <div onClick={onBlockUrlClick} className='block-url'>
      <span style={{ color: 'var(--skin-primary-color)' }}>{url}</span>
      <CommonIcon name='common-link-icon' className='search-icon' size={13} enableSkin />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .block-url {
    display: flex;
    align-items: center;
    :global(.search-icon) {
      margin-left: 8px;
      cursor: pointer;
    }
  }
`;
