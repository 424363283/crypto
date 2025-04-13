import CoinLogo from '@/components/coin-logo';
import { MobileBottomSheet } from '@/components/mobile-modal';
import { Desktop, Mobile } from '@/components/responsive';
import Modal, { ModalTitle } from '@/components/trade-ui/common/modal';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { clsx } from '@/core/utils';

export const AssetListModal = ({
  isSwapU,
  data,
  visible,
  onClose,
}: {
  isSwapU: boolean;
  data: any[];
  visible: boolean;
  onClose: () => any;
}) => {
  const unit = Swap.Info.getPriceUnitText(isSwapU);
  const { isMobile } = useResponsive();
  const content = (
    <>
      <div className='asset-list'>
        <div className='scroll'>
          {data.map((asset, i) => {
            return (
              <div key={i} className='card'>
                <div className='header'>
                  <CoinLogo width={20} height={20} coin={asset.currency || ''} />
                  <div>{asset.currency}</div>
                </div>
                <div className='border'></div>
                <div className='info'>
                  <div>
                    <div>
                      {LANG('钱包余额')}({unit})
                    </div>
                    <div>{asset.accb}</div>
                  </div>
                  <div>
                    <div>
                      {LANG('保证金余额')}({unit})
                    </div>
                    <div>{asset.margin}</div>
                  </div>
                  <div>
                    <div>
                      {LANG('可提现')}({unit})
                    </div>
                    <div>{asset.canWithdrawAmount}</div>
                  </div>
                  <div>
                    <div>
                      {LANG('未实现盈亏')}({unit})
                    </div>
                    <div className={Number(asset.unrealisedPNL) >= 0 ? 'main-raise' : 'main-fall'}>
                      {asset.unrealisedPNL}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        :global(.asset-swap-asset-list-modal) {
          width: 85vw !important;
        }
        :global(.asset-swap-asset-list-modal-content) {
          display: flex;
          max-height: 500px !important;
        }
        .asset-list {
          color: var(--theme-trade-text-color-1);
          padding-top: 12px;
          display: flex;
          flex: 1;

          .scroll {
            overflow-x: hidden;
            overflow-y: scroll;
            flex: 1;
          }
          .border {
            width: 100%;
            height: 1px;
            background: var(--skin-border-color-1);
          }
          .card {
            border-radius: 8px;
            margin-bottom: 11px;
            background-color: var(--theme-background-color-3);
            padding: 13.5px 10px 0;
            .header {
              display: flex;
              flex-direction: row;
              padding-bottom: 15px;
              :global(> *) {
                margin-right: 5px;
              }
            }
            .info {
              padding: 9px 0 5px;
              > div {
                padding: 6px 0;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                > div {
                  &:first-child {
                    color: var(--theme-trade-text-color-3);
                  }
                }
              }
            }
          }
        }
      `}</style>
    </>
  );

  return (
    <>
      <Desktop>
        <Modal
          visible={visible}
          onClose={onClose}
          contentClassName={clsx(isMobile && 'asset-swap-asset-list-modal')}
          modalContentClassName={'asset-swap-asset-list-modal-content'}
        >
          <ModalTitle title={LANG('资产详情')} onClose={onClose} />
          {content}
        </Modal>
      </Desktop>
      <Mobile>
        <MobileBottomSheet
          title={ LANG('资产详情') }
          visible={visible}
          content={content}
          close={ onClose } /> 
      </Mobile>
    </>
  );
};
