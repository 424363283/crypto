import { WalletAvatar } from '@/components/wallet-avatar';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { useState } from 'react';

export const CreatedWallets = ({
  onItemClick,
  isUsdtType,
}: {
  onItemClick: (args: { walletData: any; isUsdtType: boolean }) => any;
  isUsdtType?: boolean;
}) => {
  const [expand, setExpand] = useState(false);

  const wallets = Swap.Assets.getWallets({ usdt: false });
  const walletsU = Swap.Assets.getWallets({ usdt: true }).filter((v) => v.wallet != 'GRID');
  const data = isUsdtType ? walletsU.map((v) => ({ ...v, usdt: true })) : wallets.map((v) => ({ ...v, usdt: false }));

  return (
    <>
      <div className='created-wallets'>
        <div className='bar' onClick={() => setExpand((v) => !v)}>
          <div>
            {LANG('当前已创建子钱包个数')}{' '}
            <span>{`${data.length}/${Swap.Info.getTotalWalletCount(!!isUsdtType)}`}</span>
          </div>
          <div className='more'>{expand ? LANG('收起') : LANG('查看')}</div>
        </div>
        {expand && (
          <div className='list hide-scroll-bar'>
            {data.map((v, i) => {
              return (
                <div className='item' key={i} onClick={() => onItemClick({ walletData: v, isUsdtType: !!v.usdt })}>
                  <WalletAvatar type={v.pic} size={36} />
                  <div className='texts'>
                    <div className='name'>{v.alias}</div>
                    {!!v.remark?.length ? (
                      <div className='remark'>{v.remark}</div>
                    ) : (
                      <div className='remark-empty'></div>
                    )}
                    <div className='type'>{v.usdt ? LANG('U本位合约') : LANG('币本位合约')}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style jsx>{`
        .created-wallets {
          .bar {
            cursor: pointer;
            padding: 10px 0 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 12px;
            > div {
              color: var(--theme-trade-text-color-3);
              span {
                color: var(--theme-trade-text-color-1);
              }
            }
            .more {
              color: var(--theme-font-color-small-yellow);
            }
          }
          .list {
            padding: 0 0 10px;
            max-height: 200px;
            overflow: auto;
            .item {
              display: flex;
              border-radius: 6px;
              border: 1px solid var(--theme-border-color-1);
              padding: 16px;
              margin-bottom: 10px;
              .texts {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                margin-left: 14px;
                .name {
                  font-size: 14px;
                  font-weight: 500;
                  color: var(--theme-trade-text-color-1);
                }
                .remark {
                  width: 100%;
                  color: var(--theme-trade-text-color-3);
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  overflow: hidden;
                  margin-bottom: 8px;
                }
                .remark-empty {
                  margin-bottom: 8px;
                }
                .type {
                  height: 19px;
                  line-height: 19px;
                  border-radius: 6px;
                  padding: 0 4px;
                  background: var(--theme-trade-bg-color-8);
                  color: var(--theme-trade-text-color-3);
                }
              }
            }
          }
        }
      `}</style>
    </>
  );
};
