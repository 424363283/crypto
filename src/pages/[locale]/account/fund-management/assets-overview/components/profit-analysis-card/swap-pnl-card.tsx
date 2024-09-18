// 永续盈亏详情
import ProTooltip from '@/components/tooltip';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import css from 'styled-jsx/css';
import { WalletType } from '../types';

interface SwapPnlInfoProps {
  type: WalletType;
  totalProfit: number;
  totalLoss: number;
}
export const SwapPnlInfoCard = (props: SwapPnlInfoProps) => {
  const { totalProfit, totalLoss } = props;
  const totalValue = totalProfit.sub(Math.abs(totalLoss)).toFixed(2);
  const totalBarWidth = Math.abs(+totalValue);
  const profitBarWidth = +totalBarWidth === 0 ? '50%' : `${totalProfit.div(totalBarWidth).mul(100)?.toFixed(2)}%`;
  const lossBarWidth = +totalBarWidth === 0 ? '50%' : `${Math.abs(totalLoss).div(totalBarWidth).mul(100)?.toFixed(2)}%`;
  return (
    <div className='swap-detail-pnl'>
      <div className='top-pnl'>
        <ProTooltip title={`${LANG('总盈利')} - ${LANG('总亏损')}`}>
          <p className='label'>{LANG('净盈利/亏损')}</p>
        </ProTooltip>
        <p className={clsx('value', +totalValue >= 0 ? 'positive' : 'negative')}>
          {+totalValue > 0 ? `+${totalValue}` : totalValue}
        </p>
      </div>
      <div className='bottom-pnl'>
        <div className='pnl-area'>
          <span className='value'>{totalProfit > 0 ? `+${totalProfit.toFixed(2)}` : totalProfit?.toFixed(3)}</span>
          <span className='value'>{totalLoss?.toFixed(2)}</span>
        </div>
        <div className='bar-area'>
          <div className='bar-item profit-bar' style={{ width: profitBarWidth }} />
          <div className='bar-item loss-bar' style={{ width: lossBarWidth }} />
        </div>
        <div className='label-area'>
          <ProTooltip title={LANG('期间所有已实现获利加总')}>
            <span className='label'>{LANG('总盈利')}</span>
          </ProTooltip>
          <ProTooltip title={LANG('期间所有已实现亏损加总')}>
            <span className='label'>{LANG('总亏损')}</span>
          </ProTooltip>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .swap-detail-pnl {
    margin-top: 5px;
    .top-pnl {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--theme-border-color-2);
      padding-bottom: 12px;
      .label {
        color: var(--theme-font-color-3);
        font-size: 12px;
        border-bottom: 1px dashed var(--theme-font-color-placeholder);
      }
      .value {
        font-size: 20px;
        font-weight: 500;
        color: var(--color-green);
      }
      .negative {
        color: var(--color-red);
      }
      .positive {
        color: var(--color-green);
      }
    }
    .bottom-pnl {
      padding-top: 8px;
      .pnl-area {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .value {
          color: var(--theme-font-color-1);
          font-size: 14px;
          font-weight: 500;
        }
      }
      .bar-area {
        display: flex;
        margin: 10px 0;
        border-radius: 16px;
        overflow: hidden;
        .bar-item {
          height: 8px;
          border-radius: 8px;
          transform-origin: left center;
          transform: skew(-145deg);
        }
        .profit-bar {
          background-color: var(--color-green);
        }
        .loss-bar {
          border-bottom-right-radius: 30px;
          border-top-right-radius: 4px;
          margin-right: -10px;
          margin-left: 4px;
          background-color: var(--color-red);
        }
      }
      .label-area {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .label {
          border-bottom: 1px dashed var(--theme-font-color-placeholder);
          color: var(--theme-font-color-3);
          font-size: 12px;
        }
      }
    }
  }
`;
