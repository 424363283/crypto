import Image from '@/components/image';
import { Account } from '@/core/shared';
import { clsx } from '@/core/utils';
import { useMemo, useState } from 'react';
import css from 'styled-jsx/css';
import Amounts from './amounts';
import Banks from './banks';

const bankImages = Account.fiatCrypto.bankImages;
const AmountOptions = Account.fiatCrypto.AmountOptions;
const getBankOptions = Account.fiatCrypto.getBankOptions;
const isAmountCode = Account.fiatCrypto.isAmountCode;
const isBankCode = Account.fiatCrypto.isBankCode;
const imgUrl = Account.fiatCrypto.imgUrl;

const Img = ({ type }: { type: string }) => {
  try {
    return <Image src={`${imgUrl}/${type}.svg`} alt={type} height={22} width={52} />;
  } catch (error) {
    return <span>{type}</span>;
  }
};

const Item = ({ data = {}, amount: _amount, currencyCode, cryptoCode, price, isBuy, active }: any) => {
  const [amountIndex, setAmountIndex] = useState(0);
  const [bankIndex, setBankIndex] = useState(0);
  const { code, serve, quotaMin, quotaMax, etaTime, logo, methods: serveLogo } = data;
  const isAmount = useMemo(() => isAmountCode(code), [code]);

  const isBank = useMemo(() => isBankCode(code), [code]);
  const amount = isAmount ? AmountOptions[amountIndex] : _amount;
  const img = logo || bankImages.methods[code?.toLocaleLowerCase()] || bankImages.methods['bank'];

  return (
    <div className={clsx('payment-method', active && 'active')}>
      {active && (
        <Image
          src={'/static/images/fiat-crypto/right.svg'}
          alt={'logo'}
          height={24}
          width={24}
          className={'right_logo'}
          enableSkin
        />
      )}
      <div className={'payment-method-content'}>
        <div className='left'>
          <div className={'brand'}>
            <div className={'name-box'}>
              {img && <Image src={img} alt={'logo'} height={22} width={22} className={'img'} />}
              <div className={'name'}>{serve || '-'}</div>
            </div>
          </div>
          <div className={'limit'}>
            {quotaMin?.toFormat('all')} - {quotaMax?.toFormat('all')} {isBuy ? currencyCode : cryptoCode}
          </div>
        </div>
        <div className='right'>
          <div className={'amount'}>
            {isBuy ? `${amount?.div(price)?.toFormat(4)} ${cryptoCode}` : `${amount?.mul(price)} ${currencyCode}`}
          </div>
          <div className='rate'>
            1{cryptoCode}≈{price?.toFormat(6)}
            {currencyCode}
          </div>
        </div>
      </div>
      {serveLogo && (
        <div className={'logo'}>
          {serveLogo.map((item: string, index: number) => {
            return (
              <div className={'server-logo'} key={item}>
                <Img type={item} />
              </div>
            );
          })}
        </div>
      )}
      {isAmount ? (
        <Amounts value={amountIndex} onChange={setAmountIndex} cryptoCode={cryptoCode} price={price} />
      ) : isBank ? (
        <Banks value={bankIndex} onChange={setBankIndex} currencyCode={currencyCode} />
      ) : null}

      <style jsx>{styles}</style>
    </div>
  );
};

export default Item;

const styles = css`
  .payment-method {
    padding: 10px;
    border: 1px solid var(--theme-border-color-3);
    border-radius: 8px;
    position: relative;
    color: var(--theme-font-color-1);
    &.active {
      border-color: var(--skin-primary-color);
      background: rgba(var(--skin-primary-color-rgb), 0.1);
    }
    :global(.right_logo) {
      position: absolute;
      bottom: -3px;
      right: 0;
    }
    .payment-method-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        display: flex;
        flex-direction: column;
        gap: 10px;
        font-size: 12px;
        font-weight: 400;
        .brand {
          display: flex;
          align-items: center;
          & > div {
            display: flex;
            align-items: center;
            gap: 6px;
          }
        }
      }
      .right {
        text-align: right;
        display: flex;
        flex-direction: column;
        gap: 10px;
        .amount {
          font-size: 14px;
          font-weight: 500;
        }
        .rate {
          font-size: 12px;
          font-weight: 400;
        }
      }
    }
  }
  .logo {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 8px;
    .server-logo {
      background: rgb(245, 245, 243);
      border-radius: 4px;
      display: flex;
      align-items: center;
      padding: 0px 4px;
      :global(img) {
        height: 12px;
        width: auto;
      }
    }
  }
`;
