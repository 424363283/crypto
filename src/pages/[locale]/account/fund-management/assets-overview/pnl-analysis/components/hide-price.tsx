import css from 'styled-jsx/css';

export const HidePrice = ({ eyeOpen, children, length = 6 }: { eyeOpen: boolean; children: any; length?: number }) => {
  return eyeOpen ? (
    children
  ) : (
    <span className='hide-price'>
      {'******'.slice(0, length)}
      <style jsx>{styles}</style>
    </span>
  );
};
const styles = css`
  .hide-price {
    color: var(--theme-font-color-1);
  }
`;
