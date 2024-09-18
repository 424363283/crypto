import { Account } from '@/core/shared';
import { clsx } from '@/core/utils';
import Image from 'next/image';
import css from 'styled-jsx/css';

const Banks = ({ value, onChange, currencyCode }: any) => {
  const bankOptions = Account.fiatCrypto.getBankOptions(currencyCode);

  return (
    <div className='banks'>
      {bankOptions.map(({ code, icon }: { code: number; icon: any }, index: number) => {
        const active = value === index;
        return (
          <div className={clsx('bank', active && 'active')} key={index} onClick={() => onChange(index)}>
            <div className={'checkbox'}></div>
            <Image src={icon} alt={icon} width={37} height={37} />
          </div>
        );
      })}
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .banks {
    padding: 20px 20px 10px;
    background: var(--theme-background-color-8);
    border-radius: 5px;
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 20px;
    .bank {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;
      min-width: 25%;
      margin-bottom: 15px;
      .checkbox {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 15px;
        height: 15px;
        border: 1px solid var(--skin-color-active);
        border-radius: 50%;
        margin-right: 12px;
      }
      &.active {
        .checkbox::before {
          content: '';
          display: block;
          width: 9px;
          height: 9px;
          background-color: var(--skin-color-active);
          border-radius: 50%;
        }
      }
      :global(img) {
        height: 28px;
        width: auto;
      }
    }
  }
`;

export default Banks;
