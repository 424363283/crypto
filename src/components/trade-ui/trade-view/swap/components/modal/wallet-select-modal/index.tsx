import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';

import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { Svg } from '@/components/svg';
import { WalletAvatar } from '@/components/wallet-avatar';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { Balance } from './components/balance';
import { clsx, styles } from './styled';
import CommonIcon from '@/components/common-icon';
import { useEffect, useState } from 'react';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';
import { SWAP_DEFAULT_WALLET_KEY, WalletKey } from '@/core/shared/src/swap/modules/assets/constants';
import { message } from '@/core/utils';
import CheckboxItem from '../../checkbox-item';

export const WalletSelectModal = () => {
  const { isMobile } = useResponsive();
  const { isUsdtType, quoteId } = Swap.Trade.base;
  const walletId = Swap.Info.getWalletId(isUsdtType);

  const visible = Swap.Trade.store.modal.walletSelectVisible;
  const wallets = Swap.Assets.getWallets({ usdt: false });
  const walletsU = Swap.Assets.getWallets({ usdt: true }).filter((v) => v.wallet != 'GRID');
  const fetchShareTrader = useCopyTradingSwapStore.use.fetchShareTrader();
  const isCopyTrader = useCopyTradingSwapStore.use.isCopyTrader();
  const [value, setValue] = useState(walletId);
  const twoWayMode = Swap.Info.getTwoWayMode(isUsdtType);
  const positionData = Swap.Order.getPosition(isUsdtType);
  const calcPositionData = Swap.Calculate.positionData({
    usdt: isUsdtType,
    data: positionData,
    twoWayMode: twoWayMode,
  })
  Swap.Socket.getFlagPrice(quoteId?.toLowerCase());

  useEffect(() => {
    fetchShareTrader()
  }, []);

  useEffect(() => {
    setValue(walletId);

  }, walletId);


  const onClose = () => {
    Swap.Trade.setModal({ walletSelectVisible: false });
  };
  const _onConfirm = async () => {
    if (walletId === value) {
      onClose();
      return;
    }
    if (!isCopyTrader && value === WalletKey.COPY) {
      message.error(LANG('仅带单交易员支持跟单账户交易。'), 1);

    } else {
      Swap.Trade.onChangeWallet({ wallet: value });
      onClose();
    }

  }
  const content = (
    <>
      <div className={clsx('modal-content')}>
        {/* <div className={clsx('header')}>
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
        </div> */}
        <div className={clsx('content')}>
          <div className={clsx('scroll')}>
            <div className={clsx('wallets')}>
              {(isUsdtType ? walletsU : wallets).map((v, i) => {
                const active = value === v.wallet;
                return (
                  <div
                    key={i}
                    className={clsx('wallet', active && 'active')}
                    onClick={() => setValue(v.wallet)}
                  >
                    <div className={clsx('left')}>
                      {/* <WalletAvatar type={v.pic || ''} size={32} /> */}
                      <div className={clsx('texts', active && 'active')}>
                        <div>
                          {LANG(v.alias)}
                          {/* <CommonIcon
                            className='edit-icon'
                            name='common-edit-gray-0'
                            size={12}
                            onClick={() => Swap.Trade.setModal({ walletFormVisible: true, walletFormData: { data: v } })}
                          /> */}
                        </div>
                        <div>
                          {LANG('钱包余额')}{' '}
                          <span>
                            <Balance wallet={v.wallet} />
                          </span>
                        </div>
                        <div>
                          {LANG('未实现盈亏')}{' '}
                          <span>
                            {calcPositionData.wallets[v.wallet]?.allIncome || 0}
                          </span>
                        </div>

                      </div>
                    </div>
                    <CheckboxItem label={''} value={active} radioAttrs={{ width: 16, height: 16 }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const title = LANG('切换账户');
  if (isMobile) {
    return (
      <>
        <MobileModal visible={visible} onClose={onClose} type='bottom'>
          <BottomModal title={title} contentClassName={clsx('wallet-select-mobile-content')} onConfirm={_onConfirm} >
            <div>{content}</div>
          </BottomModal >
        </MobileModal>
        {styles}
      </>
    );
  }

  return (
    <>
      <Modal onClose={onClose} visible={visible} >
        <ModalTitle title={title} onClose={onClose} />
        {content}
        <ModalFooter onConfirm={_onConfirm} onCancel={onClose} />
      </Modal>
      {styles}
    </>
  );
};

export default WalletSelectModal;
