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

  return (
    <>
      <div className='funds-item'>
        <div className='title'>
          <div className='code'>{name}</div>
          <div className='time'>{dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}</div>
        </div>
        <div className='info'>
          <div>
            <div>{LANG('资金账户')}</div>
            <div className='wallet'>
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
        </div>
      </div>
      <style jsx>{`
        .funds-item {
          font-size: 12px;
          padding: 0 var(--trade-spacing) var(--trade-spacing);
          margin: 0 var(--trade-spacing);

          background: var(--theme-trade-bg-color-3);
          border-radius: 8px;
          margin-bottom: 8px;
          &:first-child {
            margin-top: var(--trade-spacing);
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
