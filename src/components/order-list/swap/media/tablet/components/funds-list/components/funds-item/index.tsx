import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { SWAP_FUNDS_RECORD_FUNDS_TYPE, SWAP_FUNDS_RECORD_TYPE } from '@/core/shared/src/constants/order';
import dayjs from 'dayjs';
import { ItemWallet } from '../../../item-wallet';

export const FundsItem = ({ data: item }: { data: any }) => {
  const { isUsdtType } = Swap.Trade.base;
  const name = item.currency?.toUpperCase();
  const type = (SWAP_FUNDS_RECORD_TYPE() as any)[item.type];
  const scale = Number(item.scale);
  const wallet = Swap.Assets.getWallet({ usdt: isUsdtType, walletId: item.subWallet });
  console.log(item);

  return (
    <>
      <div className="funds-item">
        <div className="item-header">
          <div className="code">
            {name} {LANG('永续')}
          </div>
          <div className="type">
            <span>{LANG('类型')}</span>
            <span>{type}</span>
          </div>
        </div>
        <div className="item-info">
          <div className="row">
            <div className="item">
              <div>{LANG('总额')}</div>
              <div
                className={
                  ['taker_fee', 'maker_fee'].includes(item.type) ? '' : Number(item.amount) > 0 ? 'profit' : 'loss'
                }
              >
                {isUsdtType ? item.amount : item.amount.toFixed(scale)}
              </div>
            </div>
            <div className="item">
              <div>{LANG('资产种类')}</div>
              <div>{item.currency}</div>
            </div>
            <div className="item">
              <div>{LANG('时间')}</div>
              <div>{dayjs(item.time).format('YYYY-MM-DD HH:mm')}</div>
            </div>
          </div>
        </div>
        {/* <div className="title">
          <div className="code">{name}</div>
          <div className="time">{dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}</div>
        </div>
        <div className="info">
          <div>
            <div>{LANG('资金账户')}</div>
            <div className="wallet">
              <ItemWallet wallet={wallet} />
            </div>
          </div>
          <div>
            <div>{LANG('类型')}</div>
            <div>{type}</div>
          </div>
          <div>
            <div>{LANG('资金类型')}</div>
            <div>{(SWAP_FUNDS_RECORD_FUNDS_TYPE() as any)[item.fundsType] || '--'}</div>
          </div>
          <div>
            <div>{LANG('总额')}</div>
            <div>{isUsdtType ? item.amount : item.amount.toFixed(scale)}</div>
          </div>
        </div> */}
      </div>
      <style jsx>{`
        .funds-item {
          font-size: 12px;
          border-bottom: 1px solid var(--fill_line_1);
          &:last-child {
            border-bottom: 0;
          }
          // padding: 0 var(--trade-spacing) var(--trade-spacing);
          // margin: 0 var(--trade-spacing);

          // background: var(--theme-trade-bg-color-3);
          // border-radius: 8px;
          // margin-bottom: 8px;
          // &:first-child {
          //   margin-top: var(--trade-spacing);
          // }
          .item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            color: var(--text_1);
            .code {
              font-size: 1rem;
              font-weight: 500;
            }
            .type {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              justify-content: flex-start;
              gap: 4px;
              > span {
                &:first-child {
                  color: var(--text_3);
                }
                &:last-child {
                  color: var(--text_1);
                }
              }
            }
          }
          .item-info {
            padding: 12px 0;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
            .row {
              width: 100%;
              display: flex;
              .item {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
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
                > div {
                  width: 100%;
                  &,
                  div {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                  }
                  &:first-child {
                    color: var(--text_3);
                  }
                  &:last-child {
                    width: 100%;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    color: var(--text_1);
                    &.profit {
                      color: var(--text_green);
                    }
                    &.loss {
                      color: var(--text_red);
                    }
                  }
                }
              }
            }
          }
          .title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
            height: 42px;
            border-bottom: 1px solid var(--theme-trade-border-color-2);
            .code {
              font-size: 16px;
              color: var(--theme-trade-text-color-1);
            }
            .time {
              font-size: 14px;
              color: var(--theme-trade-text-color-3);
            }
          }

          .info {
            > div {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 8px;
              &:last-child {
                margin-bottom: 0;
              }
              > div {
                display: flex;
                align-items: center;
                &:first-child {
                  color: var(--theme-trade-text-color-3);
                }
                &:last-child {
                  color: var(--theme-trade-text-color-1);
                }
              }
            }
            .wallet {
              display: flex;
              align-items: center;
              :global(.avatar) {
                margin-right: 4px;
              }
            }
          }
          .green {
            color: var(--color-green);
          }
          .red {
            color: var(--color-red);
          }
          .main {
            color: var(--skin-hover-font-color);
          }
          .gray {
            color: var(--theme-trade-text-color-3);
          }
        }
      `}</style>
    </>
  );
};
