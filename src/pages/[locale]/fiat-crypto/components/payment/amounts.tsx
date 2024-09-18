import { Account, Rate } from '@/core/shared';
import { clsx } from '@/core/utils';
import css from 'styled-jsx/css';

const Amounts = ({
  value,
  onChange,
  cryptoCode,
  price,
}: {
  value: number;
  onChange: (index: number) => void;
  cryptoCode: string;
  price: number;
}) => {
  const rateScaleMap = Rate.store.rateScaleMap;
  const scale = rateScaleMap[cryptoCode] || 2;
  return (
    <div className={'amounts'}>
      {Account.fiatCrypto.AmountOptions.map((amount: any, index: number) => {
        const active = value === index;
        return (
          <div className={clsx('amount', active && 'active')} key={index} onClick={() => onChange(index)}>
            {amount.toFormat('all')} ≈ {(price ? amount / price : 0)?.toFormat(scale)}
            {cryptoCode}
          </div>
        );
      })}
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .amounts {
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 20px;
    .amount {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      white-space: nowrap;
      padding: 0 10px;
      background: var(--theme-background-color-8);
      height: 38px;
      border: 1px solid var(--theme-border-color-3);
      border-radius: 3px;
      min-width: 270px;
      font-size: 14px;
      font-weight: 500;
      color: var(--theme-font-color-1);
      &.active {
        background: var(--theme-background-color-2);
        border-color: var(--skin-color-active);
        color: var(--skin-color-active);
      }
    }
  }
`;

export default Amounts;
