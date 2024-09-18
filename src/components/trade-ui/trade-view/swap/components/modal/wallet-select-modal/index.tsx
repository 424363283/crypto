import Modal, { ModalTitle } from '@/components/trade-ui/common/modal';

import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { Svg } from '@/components/svg';
import { WalletAvatar } from '@/components/wallet-avatar';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { Balance } from './components/balance';
import { clsx, styles } from './styled';

export const WalletSelectModal = () => {
  const { isMobile } = useResponsive();
  const { isUsdtType } = Swap.Trade.base;
  const walletId = Swap.Info.getWalletId(isUsdtType);

  const visible = Swap.Trade.store.modal.walletSelectVisible;
  const wallets = Swap.Assets.getWallets({ usdt: false });
  const walletsU = Swap.Assets.getWallets({ usdt: true }).filter((v) => v.wallet != 'GRID');

  const onClose = () => {
    Swap.Trade.setModal({ walletSelectVisible: false });
  };
  const content = (
    <>
      <div className={clsx('modal-content')}>
        <div className={clsx('header')}>
          <div className={clsx('tabs')}>
            <div className={clsx('tab')}>{isUsdtType ? LANG('U本位合约') : LANG('币本位合约')}</div>
          </div>
          <div
            className={clsx('right')}
            onClick={() => Swap.Trade.setModal({ walletFormVisible: true, walletFormData: null })}
          >
            <Svg src='/static/images/swap/wallet/wallet_create.svg' height={12} width={12} />
            <div>{LANG('添加子钱包')}</div>
          </div>
        </div>
        <div className={clsx('content')}>
          <div className={clsx('scroll')}>
            <div className={clsx('wallets')}>
              {(isUsdtType ? walletsU : wallets).map((v, i) => {
                return (
                  <div
                    className={clsx('wallet')}
                    key={i}
                    onClick={() => {
                      Swap.Trade.onChangeWallet({ wallet: v.wallet });
                      onClose();
                    }}
                  >
                    <div className={clsx('left')}>
                      <WalletAvatar type={v.pic || ''} size={32} />
                      <div className={clsx('texts')}>
                        <div>{v.alias}</div>
                        <div>
                          {LANG('钱包余额')}{' '}
                          <span>
                            <Balance wallet={v.wallet} />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {walletId === v.wallet && (
                        <Svg src='/static/images/common/checkbox_circle_active.svg' width={12} height={12} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const title = LANG('切换子钱包');
  if (isMobile) {
    return (
      <>
        <MobileModal visible={visible} onClose={onClose} type='bottom'>
          <BottomModal title={title} contentClassName={clsx('wallet-select-mobile-content')}>
            <div style={{ marginTop: -10 }}>{content}</div>
          </BottomModal>
        </MobileModal>
        {styles}
      </>
    );
  }

  return (
    <>
      <Modal
        onClose={onClose}
        modalContentClassName={clsx('modal-wrapper')}
        contentClassName={clsx('wallet-select-content')}
        visible={visible}
      >
        <ModalTitle title={title} border onClose={onClose} />
        {content}
      </Modal>
      {styles}
    </>
  );
};

export default WalletSelectModal;
