import { clsx } from '@/core/utils';
import css from 'styled-jsx/css';

// 链名称
export const ChainList = ({
  chains,
  changeChain,
  chain,
}: {
  chains: string[];
  changeChain: (index: number) => void;
  chain: string;
}) => {
  return (
    <div className='data-chain'>
      {chains?.map((item, index) => {
        return (
          <span
            key={index}
            className={clsx('chain', chain === item && 'active')}
            onClick={() => {
              changeChain(index);
            }}
          >
            {item}
          </span>
        );
      })}
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .data-chain {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 5px;
    .chain {
      display: inline-block;
      height: 38px;
      line-height: 38px;
      text-align: center;
      background: #fafafa;
      border-radius: 4px;
      border: 1px solid transparent;
      &.active {
        border-color: var(--skin-color-active);
        color: var(--skin-color-active);
        background: rgba(248, 187, 55, 0.04);
      }
    }
  }
`;
