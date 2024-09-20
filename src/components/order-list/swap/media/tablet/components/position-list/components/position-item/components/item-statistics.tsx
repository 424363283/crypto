import CommonIcon from '@/components/common-icon';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { isSwapDemo } from '@/core/utils/src/is';
import { ItemWallet } from '../../../../item-wallet';

export const ItemStatistics = ({
  volume,
  margin,
  marginRate,
  closePrice,
  openPrice,
  flagPrice,
  priceUnit,
  unit,
  marginType,
  onChangeMargin,
  wallet,
  callbackValue,
  onTrack,
  onWalletClick,
}: {
  volume: any;
  margin: any;
  marginRate: any;
  closePrice: any;
  openPrice: any;
  flagPrice: any;
  priceUnit: any;
  marginType: any;
  unit: any;
  onChangeMargin: any;
  wallet: any;
  callbackValue: any;
  onTrack: any;
  onWalletClick?: (walletData?: any) => any;
}) => {
  const isDemo = isSwapDemo(location.pathname);
  return (
    <>
      <div className='item-statistics'>
        <div className='row'>
          <div
            className='item'
            onClick={() => {
              if (!isDemo && Swap.Assets.walletFormat(wallet).edit) {
                if (onWalletClick) {
                  onWalletClick(wallet);
                } else {
                  Swap.Trade.setModal({ walletFormVisible: true, walletFormData: { data: wallet } });
                }
              }
            }}
          >
            <div>{LANG('子钱包账户')}</div>
            <div className='wallet'>
              <ItemWallet wallet={wallet} />
            </div>
          </div>
          <div className='item'>
            <div>
              {LANG('数量')}({unit})
            </div>
            <div>{volume}</div>
          </div>
          <div className='item' onClick={() => marginType === 2 && onChangeMargin()}>
            <div>
              {LANG('保证金')}({priceUnit})
            </div>
            <div>
              {margin}
              {marginType === 2 && (
                <CommonIcon name='common-small-edit-0' width={12} height={13} enableSkin className='icon' />
              )}
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='item'>
            <div>{LANG('保证金率')}</div>
            <div>{marginRate}</div>
          </div>
          {/* <div className='item'>
            <div>
              {LANG('开仓价格')}({priceUnit})
            </div>
            <div>{openPrice}</div>
          </div> */}

          <div className='item'>
            <div>
              {LANG('强平价格')}({priceUnit})
            </div>
            <div>{closePrice}</div>
          </div>
          {/* <div className='item' onClick={onTrack}>
            <div className='track-item'>
              {LANG('追踪出场')}
              <CommonIcon name='common-small-edit-0' width={12} height={13} enableSkin className='icon' />
            </div>
            <div>{Number(callbackValue) > 0 ? callbackValue : LANG('暂未设置')}</div>
          </div> */}
        </div>
      </div>
      <style jsx>{`
        .item-statistics {
          margin-top: 12px;
          font-size: 12px;

          .row {
            width: 100%;
            display: flex;
            margin-bottom: 8px;
            &:last-child {
              margin-bottom: 0;
            }
            .item {
              flex: 1;
              display: flex;
              flex-direction: column;
              overflow: hidden;
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
                  color: var(--theme-trade-text-color-3);
                }
                &:last-child {
                  width: 100%;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  margin-top: 4px;

                  color: var(--theme-trade-text-color-1);
                  :global(.icon) {
                    margin-left: 3px;
                  }
                }
              }
            }
          }
          .track-item {
            justify-content: flex-end;
          }
          .wallet,
          .track-item {
            display: flex;
            align-items: center;
            > :global(*):last-child {
              margin-left: 4px;
            }
          }
          .wallet-avatar {
            flex: none;
          }
        }
      `}</style>
    </>
  );
};
