import { BottomModal, MobileModal } from '@/components/mobile-modal';

import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';

import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { useLeverModal } from './hooks';

export const LeverModal = () => {
  const { isMobile } = useResponsive();
  const visible = Swap.Trade.store.modal.leverVisible;
  const title = LANG('杠杆调整');
  const { content, value, lever, onConfirm, onClose } = useLeverModal({ visible });
  if (isMobile) {
    return (
      <MobileModal visible={visible} onClose={onClose} type='bottom'>
        <BottomModal title={title} onConfirm={onConfirm} disabledConfirm={lever === value}>
          {content}
        </BottomModal>
      </MobileModal>
    );
  }
  return (
    <>
      <Modal visible={visible} onClose={onClose}>
        <ModalTitle title={title} onClose={onClose} />
        {content}
        <ModalFooter onConfirm={onConfirm} onCancel={onClose} disabledConfirm={lever === value} />
      </Modal>
    </>
  );
};

export default LeverModal;
