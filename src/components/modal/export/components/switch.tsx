import { clsx } from '@/core/utils';
import css from 'styled-jsx/css';

const Switch = ({ active, onClick = () => {} }: { active: boolean; onClick: () => void }) => {
  return (
    <div className={clsx('switch', active && 'active')} onClick={onClick}>
      <i />
      <style jsx>{styles}</style>
    </div>
  );
};

export default Switch;
const styles = css`
  .switch {
    width: 16px;
    height: 16px;
    border: 1px solid var(--skin-primary-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &.active {
      i {
        display: inline-block;
        width: 8px;
        height: 8px;
        background: var(--skin-primary-color);
        border-radius: 50%;
      }
    }
  }
`;
