import { RateText } from '@/components/rate-text';
import { DesktopOrTablet, Mobile } from '@/components/responsive';
import { MediaInfo, clsx } from '@/core/utils';
import React from 'react';
import css from 'styled-jsx/css';
import { store } from '../../../components/store';

export const AssetItem: React.FC<{
  title: string;
  amount: number | string;
  color: string;
  percent: string;
}> = React.memo(({ title, amount, color, percent }) => {
  const { hideBalance } = store;
  amount = +amount < 0 ? 0 : amount;
  const AmountArea = () => {
    return (
      <div className='amount-area'>
        {!hideBalance ? <span> {amount.toFormat(3)} USDT</span> : '******'}
        <div className='cover'>
          {!hideBalance ? <RateText money={amount} suffix showCurrencySymbol currency='USDT' useFormat /> : '******'}
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  };
  return (
    <div className={clsx('asset-card')}>
      <div className='title'>
        <span className='dot' style={{ backgroundColor: color }}></span>
        {title}
        <Mobile>
          <AmountArea />
        </Mobile>
      </div>
      <DesktopOrTablet>
        <AmountArea />
      </DesktopOrTablet>
      <div className='percent-area'>
        {!hideBalance ? (
          <>
            <p className='percent'>{percent.mul(100).toFixed(4)}%</p>
            <div className='bar'>
              <div className='bar-inner' style={{ width: `${percent.mul(100)}%` }} />
            </div>
          </>
        ) : (
          <div>******</div>
        )}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
});
const styles = css`
  .asset-card {
    display: flex;
    margin-bottom: 15px;
    justify-content: space-between;
    align-items: center;
    .title {
      color: var(--theme-font-color-1);
      font-size: 14px;
      flex: 1;
      @media ${MediaInfo.desktop} {
        flex-wrap: nowrap;
        word-break: keep-all;
        display: flex;
        align-items: center;
      }
      .dot {
        width: 12px;
        height: 12px;
        border-radius: 3px;
        display: inline-block;
        margin-right: 5px;
      }
    }
    .amount-area {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      flex: 1;
      font-size: 14px;
      font-weight: 500;
      span {
        word-break: keep-all;
      }
      color: var(--theme-font-color-6);
      .cover {
        word-break: keep-all;
        font-size: 12px;
        font-weight: 500;
        color: var(--theme-font-color-3);
      }
      @media ${MediaInfo.mobile} {
        margin-top: 15px;
      }
    }
    .percent-area {
      flex: 1;
      margin-right: 30px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      color: var(--theme-font-color-6);
      @media ${MediaInfo.mobile} {
        margin-right: 0px;
        margin-top: 15px;
      }
      .percent {
        font-size: 14px;
        font-weight: 500;
        color: var(--theme-font-color-1);
      }
      .bar {
        width: 46px;
        height: 4px;
        border-radius: 8px;
        background: var(--theme-background-color-8);
        margin-top: 10px;
        .bar-inner {
          border-radius: 8px;
          height: 4px;
          background: var(--theme-sub-button-bg-5);
        }
      }
    }
  }
`;
