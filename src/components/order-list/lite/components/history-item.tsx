import { LANG } from '@/core/i18n';
import ClipboardItem from '@/components/clipboard-item';
import YIcon from '@/components/YIcons';

export const ItemHeader = ({
  name,
  isBuy,
  lever,
  income,
  incomeRate,
  shareItem
}: {
  name: string;
  isBuy: boolean;
  lever: number;
  income: number;
  incomeRate: number;
  shareItem: () => void;
}) => (
  <>
    <div className="item-header">
      <div className="left">
        <span className="name">{name}</span>
        <div className="info">
          <div className={`type ${isBuy ? 'buy' : 'sell'}`}>{LANG(isBuy ? '买涨' : '买跌')}</div>
          <span>{lever}x</span>
        </div>
      </div>
      <div className="right">
        <div className="num">
          <span className={`income ${income >= 0 ? 'main-green' : 'main-red'}`}>
            {' '}
            {income >= 0 ? '+' : ''}
            {income.toFixed(2)}
          </span>
          <span className={`rate ${income >= 0 ? 'main-green' : 'main-red'}`}>
            {' '}
            {incomeRate >= 0 ? '+' : ''}
            {incomeRate.toFixed(2)}%
          </span>
        </div>
        <div className="share" onClick={() => shareItem()}>
          <YIcon.shareIcon />
        </div>
      </div>
    </div>
    <style jsx>{`
      .item-header {
        display: flex;
        justify-content: space-between;
        .left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }
        .left {
          color: var(--text_1);
          font-weight: 400;
          .name {
            font-size: 1rem;
            font-weight: 500;
          }
          .info {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            gap: 4px;
            font-size: 14px;
            .type {
              width: 3rem;
              height: 1.25rem;
              border-radius: 4px;
              line-height: 1.25rem;
              text-align: center;
              font-size: 12px;
              color: var(--text_white);
              &.buy {
                background: var(--color-green);
              }
              &.sell {
                background: var(--color-red);
              }
            }
          }
        }
        .right {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 1rem;
          .num {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
          .income {
            font-size: 1rem;
            font-weight: 500;
          }
          .rate {
            font-size: 14px;
            font-weight: 400 !important;
          }
          .share {
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 1.5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            background: var(--brand);
            :global(svg) {
              width: 12px;
              height: 12px;
            }
            :global(path) {
              fill: var(--text_white);
            }
          }
        }
      }
    `}</style>
  </>
);

export const ItemStatistics = ({
  id,
  opPrice,
  cpPrice,
  opTime,
  cpTime,
  volume,
  margin,
  stopProfit,
  stopLoss
}: {
  id: string;
  opPrice: string;
  cpPrice: string;
  opTime: string;
  cpTime: string;
  volume: string;
  margin: string;
  stopProfit: string;
  stopLoss: string;
}) => (
  <>
    <div className="item-statistics">
      <div className="row">
        <div className="item">
          <span className="label">{LANG('开仓价格')}</span>
          <span>{opPrice}</span>
        </div>
        <div className="item">
          <span className="label">{LANG('平仓成交价')}</span>
          <span>{cpPrice}</span>
        </div>
        <div className="item">
          <span className="label">{LANG('仓位数量')}</span>
          <span>{volume}</span>
        </div>
      </div>
      <div className="row">
        <div className="item">
          <span className="label">{LANG('保证金')}</span>
          <span>{margin}</span>
        </div>
        <div className="item">
          <span className="label">{LANG('止盈')}</span>
          <span>{stopProfit}</span>
        </div>
        <div className="item">
          <span className="label">{LANG('止损')}</span>
          <span>{stopLoss}</span>
        </div>
      </div>
      <div className="row">
        <div className="item">
          <span className="label">{LANG('开仓时间')}</span>
          <span>{opTime}</span>
        </div>
        <div className="item">
          <span className="label">{LANG('平仓时间')}</span>
          <span>{cpTime}</span>
        </div>
        <div className="item">
          <span className="label">{LANG('订单编号')}</span>
          <ClipboardItem text={id} />
        </div>
      </div>
    </div>
    <style jsx>{`
      .item-statistics {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
        font-size: 12px;
        font-weight: 400;
        color: var(--text_1);
        .row {
          width: 100%;
          display: flex;
        }
        .item {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          &:nth-child(1) {
            align-items: start;
          }
          &:nth-child(2) {
            align-items: start;
          }
          &:nth-child(3) {
            align-items: end;
            text-align: right;
          }
          .label {
            color: var(--text_3);
          }
          .content {
            display: flex;
            gap: 4px;
            align-items: center;
            .btn {
              width: 3rem;
              height: 1.25rem;
              line-height: 1.25rem;
              text-align: center;
              background: var(--brand);
              border-radius: 1.5rem;
              color: var(--text_white);
              font-size: 12px;
              font-weight: 400;
            }
          }
        }
      }
    `}</style>
  </>
);
