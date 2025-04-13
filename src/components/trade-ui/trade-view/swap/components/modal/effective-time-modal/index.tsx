import { useEffect, useState } from 'react';

import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';

import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { Svg } from '@/components/svg';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { clsx, styles } from './styled';
import Radio from '@/components/Radio';

export const EffectiveTimeModal = () => {
  const { isMobile } = useResponsive();
  const [value, setValue] = useState(0);
  const effectiveTime = Swap.Trade.store.effectiveTime;
  const visible = Swap.Trade.store.modal.effectiveTimeVisible;

  const options = [
    [LANG('GTC(GoodtillCancel)'), LANG('普通限价单，一直有效直至取消'), 0],
    [LANG('IOC(lmmediately or Cancel)'), LANG('订单若不能立即成交则未成交的部分立即取消。'), 8],
    [LANG('FOK(Fill or Kill)'), LANG('订单若不能全部成交则立即全部取消。'), 1],
  ];

  const onClose = () => Swap.Trade.setModal({ effectiveTimeVisible: false });
  const _onConfirm = () => {
    Swap.Trade.store.effectiveTime = value;
    onClose();
  };

  useEffect(() => {
    if (visible) {
      setValue(effectiveTime);
    }
  }, [visible]);

  const content = (
    <>
      <div className={clsx('effective-time-modal')}>
        {options.map(([title, tips, v], i) => {
          const active = v === value;
          return (
            <div className={clsx('item', active && 'active')} key={i} onClick={() => setValue(v as number)}>
              <div className={clsx('title-wrapper')}>
                <div className={clsx('title')}>{title}</div>
                <div className={clsx('tips')}>{tips}</div>
              </div>
              <Radio
                label={''}
                checked={active}
                {...{ width: 16, height: 16 }}
              />
            </div>
          );
        })}
      </div>
      {styles}
    </>
  );

  if (isMobile) {
    return (
      <MobileModal visible={visible} onClose={onClose} type='bottom'>
        <BottomModal title={LANG('生效时间')} onConfirm={_onConfirm}>
          {content}
        </BottomModal>
      </MobileModal>
    );
  }

  return (
    <>
      <Modal visible={visible} onClose={onClose}>
        <ModalTitle title={LANG('生效时间')} onClose={onClose} />
        {content}
        <ModalFooter onConfirm={_onConfirm} onCancel={onClose} />
      </Modal>
    </>
  );
};

export default EffectiveTimeModal;
