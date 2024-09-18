import Image from '@/components/image';
import { BottomModal, MobileModal } from '@/components/mobile-modal';
import Modal, { ModalTitle } from '@/components/trade-ui/common/modal';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, Swap } from '@/core/shared';
import { zIndexMap } from '@/core/styles/src/theme/global/z-index';
import { useEffect } from 'react';
import { useAgreement } from '../../agreement';
import { clsx, styles } from './styled';
const WelcomeDemoModal = () => {
  const visible = Swap.Trade.store.modal.welcomeDemoVisible;
  let { loading, allow, onArgee } = useAgreement();
  const { isMobile } = useResponsive();
  const title = '';

  const confirm = async () => {
    Swap.Trade.setModal({ welcomeDemoVisible: false });
    await onArgee();
  };
  const content = (
    <div className={clsx('modal-content')}>
      <Image src='/static/images/swap/demo/welcome.png' alt='welcome' width={260} height={280} />
      <div className={clsx('tips')}>{LANG('使用 $50,000 模拟资产进行交易')}</div>
      <div className={clsx('button')} onClick={confirm}>
        {LANG('欢迎体验模拟交易')}
      </div>
    </div>
  );
  const onClose = () => {
    confirm();
  };
  useEffect(() => {
    if (Account.isLogin && !loading && !allow) {
      Swap.Trade.setModal({ welcomeDemoVisible: true });
    }
  }, [loading, allow]);

  if (isMobile) {
    return (
      <>
        <MobileModal
          visible={visible}
          onClose={onClose}
          type='bottom'
          zIndex={zIndexMap['--zindex-trade-pc-modal'] + 1}
        >
          <BottomModal
            title={title}
            contentClassName={clsx('welcome-demo-mobile-content')}
            displayConfirm={false}
            className={clsx('welcome-demo-mobile-modal')}
          >
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
        zIndex={zIndexMap['--zindex-trade-pc-modal'] + 1}
        onClose={onClose}
        visible={visible}
        contentClassName={clsx('welcome-demo-content')}
        modalContentClassName={clsx('welcome-demo-modal-content')}
      >
        <ModalTitle title={title} onClose={onClose} />
        {content}
      </Modal>
      {styles}
    </>
  );
};

export default WelcomeDemoModal;
