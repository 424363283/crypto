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
  className?: string;
}> = React.memo(({ title, amount, color, percent, className }) => {
  const { hideBalance } = store;
  amount = +amount < 0 ? 0 : amount;
  const AmountArea = () => {
    return (
      <div className='amount-area'>
        {!hideBalance ? <span> {amount.toFormat(2)} USDT</span> : '******'}
        <div className='cover'>
          ≈ {!hideBalance ? <RateText money={amount} suffix showCurrencySymbol currency='USDT' useFormat /> : '******'}
        </div>
      </div>
    );
  };
  return (
    <div className={clsx('asset-card', className)}>
      <div className='title'>
        <span className='dot' style={{ backgroundColor: color }}></span>
        {title}
      </div>
      <AmountArea />
      <DesktopOrTablet>
        <div className='percent-area'>
          {!hideBalance ? (
            <>
              <p className='percent'>{percent.mul(100).toFixed(2)}%</p>
              <div className='bar'>
                <div className='bar-inner' style={{ width: `${percent.mul(100)}%` }} />
              </div>
            </>
          ) : (
            <div>******</div>
          )}
        </div>
      </DesktopOrTablet>
      <style jsx>{`
        .asset-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .title {
            color: var(--text-primary);
            font-size: 14px;
            flex: 1;
            @media ${MediaInfo.desktop} {
              flex-wrap: nowrap;
              word-break: keep-all;
              display: flex;
              align-items: center;
            }
            .dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              display: inline-block;
              margin-right: 5px;
            }
          }
          :global(.amount-area) {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            flex: 1;
            font-size: 14px;
            font-weight: 500;
            color: var(--text-primary);
            gap: 8px;
            :global(span) {
              word-break: keep-all;
            }
            :global(.cover) {
              word-break: keep-all;
              font-size: 12px;
              font-weight: 400;
              color: var(--text-tertiary);
            }
            @media ${MediaInfo.mobile} {
              margin-top: 8px;
              gap: 4px;
            }
          }
          .percent-area {
            flex: 1;
            margin-right: 30px;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            color: var(--text-primary);
            @media ${MediaInfo.mobile} {
              margin-right: 0px;
              margin-top: 15px;
            }
            .percent {
              font-size: 14px;
              font-weight: 500;
              color: var(--text-primary);
            }
            .bar {
              width: 46px;
              height: 4px;
              border-radius: 8px;
              background: var(--fill-3);
              margin-top: 10px;
              .bar-inner {
                border-radius: 8px;
                height: 4px;
                background: ${color};
              }
            }
          }
        }
      `}</style>
    </div>
  );
});
