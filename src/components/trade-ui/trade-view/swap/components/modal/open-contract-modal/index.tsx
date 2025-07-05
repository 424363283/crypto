import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { useResponsive, useRouter, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, Swap } from '@/core/shared';

import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';

import { clsx, styles } from './styled';
import { ContentView } from '../../agreement/components/content-view';

/**
 * @prop {boolean} visible    是否显示
 * @prop {function} onClose   关闭事件
 * @prop {function} onChange  修改事件
 */
export const OpenContractModal = () => {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const visible = Swap.Trade.store.modal.openContractVisible;
  const title = LANG('开通合约账户'); 
  const onArgee = async () => {
    if (!Account.isLogin) {
      router.push('/login');
      return;
    }
    await Swap.Info.agreementConfirm();
    Swap.Trade.onAgreementDone();
    onClose();
  };
  const onClose = () => {
    Swap.Trade.setModal({ openContractVisible: false });
  };

  const content = (
    <>
      <div className={clsx('open-contract-content')}>
        <div className={clsx('open-contract-title')}> {LANG('您的账户未开通合约交易。请开通合约账户后，再尝试进行转账。')} </div>
        <div className={clsx('open-contract-modal')}>
          <ContentView title='' onArgee={onArgee} />
        </div>
      </div>
      {styles}
    </>
  );

  if (isMobile) {
    return (
      <MobileModal visible={visible} onClose={onClose} type='bottom'>
        <BottomModal title={title} confirmText={LANG('立即开户')} onConfirm={onArgee}>
          <div className='hide-scroll-bar' style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {content}
          </div>
        </BottomModal>
      </MobileModal>
    );
  }

  return (
    <>
      <Modal visible={visible} onClose={onClose}>
        <ModalTitle title={title} onClose={onClose} />
        {content}
      </Modal>
      <style jsx>
      {`
        :global(.swap-common-modal) {
          :global(.swap-common-modal-content-component) {
            padding: 40px 0 0!important;
          }
        }
      `}
    </style>
    </>
  );
};

export default OpenContractModal;
