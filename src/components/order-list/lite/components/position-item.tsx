import { LANG } from '@/core/i18n';
import ClipboardItem from '@/components/clipboard-item';
import YIcon from '@/components/YIcons';
import { clsx, formatDefaultText } from '@/core/utils';

export const ItemHeader = ({
  name,
  isBuy,
  lever,
  income,
  incomeRate
}: {
  name: string;
  isBuy: boolean;
  lever: number;
  income: number;
  incomeRate: number;
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
    </div>
    <style jsx>{`
      .item-header {
        display: flex;
        justify-content: space-between;
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
          align-items: flex-end;
          .income {
            font-size: 1rem;
            font-weight: 500;
          }
          .rate {
            font-size: 14px;
            font-weight: 400 !important;
          }
        }
      }
    `}</style>
  </>
);

export const ItemStatistics = ({
  id,
  isBuy,
  price,
  opPrice,
  opTime,
  commodityName,
  currency,
  volume,
  margin,
  fPrice,
  lPrice,
  trailPrice,
  offsetPrice,
  defer,
  addMargin,
  setShiftStopLoss
}: {
  id: string;
  isBuy: boolean;
  price: string;
  opPrice: string;
  opTime: string;
  commodityName: string;
  currency: string;
  volume: string;
  margin: string;
  fPrice: string;
  lPrice: string;
  trailPrice: string | number;
  offsetPrice: number;
  defer: boolean;
  addMargin: () => void;
  setShiftStopLoss: () => void;
}) => (
  <>
    <div className="item-statistics">
      <div className="row">
        <div className="item">
          <span className="label">{LANG('当前价格')}</span>
          <span>{price}</span>
        </div>
        <div className="item">
          <span className="label">{LANG('开仓价格')}</span>
          <span>{opPrice}</span>
        </div>
        <div className="item">
          <span className="label">{LANG('仓位数量')}</span>
          <span>
            {volume} {commodityName}
          </span>
        </div>
      </div>
      <div className="row">
        <div className="item">
          <span className="label">{LANG('保证金')}</span>
          <span className="content" onClick={addMargin}>
            {`${margin} ${currency}`}
            <YIcon.positionEdit className={clsx('editIcon')} />
          </span>
        </div>
        <div className="item">
          <span className="label">{LANG('止盈价格')}</span>
          <span>
            {fPrice}
          </span>
        </div>
        <div className="item">
          <span className="label">{LANG('强平价格')}</span>
          <span>
            {lPrice}
          </span>
        </div>
      </div>
      <div className="row">
        {/* <div className="item">
          <span className="label">{LANG('移动止损(距离)')}</span>
          <div className="content" onClick={setShiftStopLoss}>
            {trailPrice == 0 ? (
              <div className="btn">{LANG('添加')}</div>
            ) : (
              <>
                <div style={{ display: 'flex' }}>
                  <span style={{ fontWeight: 'bold' }}>{isBuy ? '≤' : '≥'}</span>
                  {trailPrice}
                  <span className={offsetPrice >= 0 ? 'main-green' : 'main-red'}>
                    ({formatDefaultText(offsetPrice)})
                  </span>
                </div>

                <YIcon.positionEdit className={clsx('editIcon')} />
              </>
            )}
          </div>
        </div> */}
        <div className="item">
          <span className="label">{LANG('开仓时间')}</span>
          <span>{opTime}</span>
        </div>
        <div className="item">
          <span className="label">{LANG('是否递延')}</span>
          <span>{LANG(defer ? '是' : '否')}</span>
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
