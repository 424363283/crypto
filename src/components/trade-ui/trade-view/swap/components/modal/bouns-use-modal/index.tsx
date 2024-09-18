import { useEffect, useState } from 'react';

import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';

import Image from '@/components/image';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { SWAP_BOUNS_WALLET_KEY } from '@/core/shared/src/swap/modules/assets/constants';
import { LOCAL_KEY, resso, useResso } from '@/core/store';
import { appFullScreenModalState } from '@/core/store/src/app/app-full-screen-modal-state';
import { CACHED_KEY } from '@/core/store/src/resso/resso';
import { zIndexMap } from '@/core/styles/src/theme/global/z-index';
import { clsxWithScope } from '@/core/utils';
import css from 'styled-jsx/css';
import { swapTradeStore } from '../../../utils';
import { walleViewGuideGuideStore } from '../../bouns-guide/components/wallet-view-guide';

const _store = resso({ showed: false }, { nameSpace: LOCAL_KEY.TRADE_UI_SWAP_BOUNS_USE_MODAL });

export const BounsUseModal = () => {
  const store = useResso(_store);
  const { isMobile } = useResponsive();
  const [visible, _setVisible] = useState(false);
  const onClose = () => setVisible(false);
  const isUsdtType = Swap.Trade.base.isUsdtType;
  const balance = Swap.Assets.getBalanceData({ withHooks: false, usdt: isUsdtType, walletId: SWAP_BOUNS_WALLET_KEY });
  const digit = Swap.Assets.getBalanceDigit({ usdt: isUsdtType });
  const { allow } = Swap.Info.store.agreement;
  const { headerSwapDemoGuide } = swapTradeStore;
  const haveModal = appFullScreenModalState.haveModal;
  const setVisible = (value: boolean) => {
    if (value === true) {
      if (!appFullScreenModalState.haveModal) {
        appFullScreenModalState.haveModal = value;
        _setVisible(value);
      }
    } else {
      appFullScreenModalState.haveModal = value;
      _setVisible(value);
    }
  };
  useEffect(() => {
    if (
      !headerSwapDemoGuide &&
      !appFullScreenModalState.haveModal &&
      allow &&
      store[CACHED_KEY] &&
      !visible &&
      !store.showed &&
      balance.bonusAmount > 0
    ) {
      setVisible(true);
      store.showed = true;
    }
  }, [balance, store.showed, visible, store[CACHED_KEY], allow, headerSwapDemoGuide, haveModal]);

  const _onConfirm = () => {
    if (isMobile) {
      Swap.Info.setWalletId(isUsdtType, SWAP_BOUNS_WALLET_KEY);
    } else {
      walleViewGuideGuideStore.setIsOpen(true);
    }
    setVisible(false);
  };

  const content = (
    <>
      <div className='bouns-use-modal'>
        <Image src='/static/images/swap/wallet/have_bouns.png' width={126.54} height={140} alt='bouns icon' />
        <div className='title'>{LANG('温馨提示')}</div>
        <div className='content'>
          {LANG('您的合约账户内存有：{amount} {cryoto} 可用体验金', {
            cryoto: balance.currency,
            amount: balance.bonusAmount.toFixed(digit),
          })}
        </div>
        <div className='content'>{LANG('请随时体验我们的服务，尽情享受交易乐趣！')}</div>
      </div>
      <style jsx>{`
        .bouns-use-modal {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-bottom: 30px;
          color: var(--theme-font-color-1);
          .title {
            font-size: 20px;
            font-weight: 500;
            margin: 15px 0;
          }
          .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: left;
            width: 95%;
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );

  if (!visible) {
    return <></>;
  }

  if (isMobile) {
    return (
      <MobileModal visible={visible} onClose={onClose} type='bottom'>
        <BottomModal title={''} onConfirm={_onConfirm} confirmText={LANG('去使用')}>
          {content}
        </BottomModal>
      </MobileModal>
    );
  }

  return (
    <>
      <Modal
        visible={visible}
        onClose={onClose}
        contentClassName={clsx('bouns-use-modal-content')}
        zIndex={zIndexMap['--zindex-trade-pc-modal'] + 99}
      >
        <ModalTitle title={null} onClose={onClose} />
        {content}
        <ModalFooter onConfirm={_onConfirm} onCancel={onClose} confirmText={LANG('去使用')} />
      </Modal>
      {_styles}
    </>
  );
};

const { className, styles: _styles } = css.resolve`
  .bouns-use-modal-content {
    width: 450px !important;
  }
`;
const clsx = clsxWithScope(className);
export default BounsUseModal;
