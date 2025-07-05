import { LANG } from '@/core/i18n';
import ClipboardItem from '@/components/clipboard-item';

export const ItemHeader = ({
  name,
  isBuy,
  lever,
  revokeOrder
}: {
  name: string;
  isBuy: boolean;
  lever: number;
  revokeOrder: () => void;
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
        <div className="revoke-btn" onClick={revokeOrder}>
          {LANG('撤单')}
        </div>
      </div>
    </div>
    <style jsx>{`
      .item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left,
        .right {
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
          .revoke-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 5.5rem;
            height: 2rem;
            border-radius: 1.375rem;
            background: var(--brand);
            color: var(--text_white);
            font-size: 12px;
            font-weight: 400;
          }
        }
      }
    `}</style>
  </>
);

export const ItemStatistics = ({
  id,
  triggerPrice,
  safetyPrice,
  opTime,
  currency,
  margin,
  lPrice,
  fPrice,
  defer
}: {
  id: string;
  triggerPrice: string;
  safetyPrice: string;
  opTime: string;
  currency: string;
  margin: string;
  lPrice: string;
  fPrice: string;
  defer: boolean;
}) => (
  <>
    <div className="item-statistics">
      <div className="row">
        <div className="item">
          <span className="label">{LANG('委托价格')}</span>
          <span>{triggerPrice}</span>
        </div>
        <div className="item">
          <span className="label">{LANG('委托成交价')}</span>
          <span>{safetyPrice}</span>
        </div>
        <div className="item">
          <span className="label">{LANG('保证金')}</span>
          <span>
            {margin} {currency}
          </span>
        </div>
      </div>
      <div className="row">
        <div className="item">
          <span className="label">{LANG('止盈价格')}</span>
          <span>
            {fPrice}
          </span>
        </div>
        <div className="item">
          <span className="label">{LANG('是否递延')}</span>
          <span>{LANG(defer ? '是' : '否')}</span>
        </div>
        <div className="item">
          <span className="label">{LANG('强平价格')}</span>
          <span>
            {lPrice}
          </span>
        </div>
      </div>
      <div className="row">
        <div className="item">
          <span className="label">{LANG('挂单时间')}</span>
          <span>{opTime}</span>
        </div>
        <div className="item" />
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
        }
      }
    `}</style>
  </>
);
