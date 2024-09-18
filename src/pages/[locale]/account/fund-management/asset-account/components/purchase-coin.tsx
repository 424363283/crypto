import { useTheme } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import Image from 'next/image';
import React from 'react';
import css from 'styled-jsx/css';

interface FiatCurrencyProps {
  options: {
    code: string;
  }[];
  oIndex: number;
}
const logoArr = [
  '/static/images/account/fund/logo_0.png',
  '/static/images/account/fund/logo_1.png',
  '/static/images/account/fund/logo_2.png',
  '/static/images/account/fund/logo_3.png',
];
const currencyArr = [
  'USDT',
  'USDC',
  'BUSD',
  'BTC',
  'ETH',
  'XRP',
  'DOGE',
  'DOT',
  'LINK',
  'BAT',
  'MANA',
  'CHZ',
  'AAVE',
  'COMP',
  'LTC',
];

const FiatCurrency: React.FC<FiatCurrencyProps> = ({ options = [], oIndex = 0 }) => {
  const currentCoin = options?.[oIndex]?.code;
  const { isDark } = useTheme();
  return (
    <>
      {currencyArr?.includes(currentCoin) && (
        <TrLink className='fiat-currency' href='/fiat-crypto' native query={{ code: currentCoin?.toLowerCase() }}>
          <div className='fiat-title'>
            <span style={{ marginRight: '6px' }}>{LANG('购买')}</span>
            {currentCoin}
          </div>
          <div className='fiat-logo'>
            <div className='left'>
              {logoArr?.map((src, index) => {
                if (index > 2) return null;
                return <Image src={src} alt='' width={20} height={20} key={index} />;
              })}
            </div>
            <div className='right'>
              <Image
                src={isDark ? '/static/images/account/fund/banxa.png' : '/static/images/account/fund/logo_3.png'}
                alt=''
                width={80}
                height={15}
              />
            </div>
          </div>
          <style jsx>{styles}</style>
        </TrLink>
      )}
    </>
  );
};
const styles = css`
  :global(.fiat-currency) {
    cursor: pointer;
    border-radius: 8px;
    border: 1px solid var(--theme-border-color-2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    margin-top: 15px;
    height: 48px;
    :global(.fiat-title) {
      font-size: 14px;
      font-weight: 500;
      color: var(--theme-font-color-1);
    }
    :global(.fiat-logo) {
      display: flex;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        :global(img) {
          width: 20px;
          height: 20px;
          margin-right: 16px;
        }
      }
      :global(.right) {
        padding-left: 16px;
        border-left: 1px solid #d8d8d8;
      }
    }
  }
`;
export default FiatCurrency;
