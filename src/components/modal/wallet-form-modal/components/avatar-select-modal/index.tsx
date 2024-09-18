import Modal, { ModalFooter, ModalTitle } from '@/components/trade-ui/common/modal';

import { BottomModal, MobileModal } from '@/components/mobile-modal';
import { WalletAvatar, WalletAvatarColors, WalletAvatarOptionImages, splitType } from '@/components/wallet-avatar';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { zIndexMap } from '@/core/styles/src/theme/global/z-index';
import { useEffect, useState } from 'react';
import { clsx, styles } from './styled';

export const AvatarSelectModal = ({
  visible,
  onClose,
  value: _value,
  onChange,
}: {
  visible: boolean;
  onClose: any;
  value: string;
  onChange: (v: string) => any;
}) => {
  const [value, setValue] = useState('');
  const { isMobile } = useResponsive();
  const title = LANG('How are feeling about this portfolio?');
  const { color, emoji } = splitType(value);

  useEffect(() => {
    setValue(_value);
  }, []);

  const _onConfirm = () => {
    onChange(value);
    onClose();
  };

  const _onChange = ({ color: _color, emoji: _emoji }: any) => {
    setValue(`${_color || color}_${_emoji || emoji}`);
  };

  const content = (
    <>
      <div className={clsx('modal-content')}>
        <div className={clsx('top')}>
          <WalletAvatar type={value} size={72} />
          <div className={clsx('colors')}>
            {WalletAvatarColors.map((v, i) => {
              const active = color === v;
              return (
                <div
                  className={clsx(active && 'active')}
                  key={i}
                  style={{ borderColor: active ? `#${v}` : undefined }}
                  onClick={() => _onChange({ color: v })}
                >
                  <div
                    className={clsx()}
                    style={{ backgroundColor: `#${v}`, height: active ? 18 : 20, width: active ? 18 : 20 }}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={clsx('emoji-title')}>{LANG('Chose your emoji')}</div>

        <div className={clsx('emojis')}>
          {Object.keys(WalletAvatarOptionImages).map((v, i) => {
            const active = emoji === v;
            return (
              <div className={clsx(active && 'active')} key={i} onClick={() => _onChange({ emoji: v })}>
                <WalletAvatar emoji={v} optionMode size={isMobile ? 40 : 48} transparent />
              </div>
            );
          })}
        </div>
      </div>
      {styles}
    </>
  );

  if (isMobile) {
    return (
      <>
        <MobileModal
          visible={visible}
          onClose={onClose}
          type='bottom'
          zIndex={zIndexMap['--zindex-trade-pc-modal'] + 2}
        >
          <BottomModal title={title} onConfirm={_onConfirm}>
            {content}
          </BottomModal>
        </MobileModal>
        {styles}
      </>
    );
  }

  return (
    <>
      <Modal onClose={onClose} visible={visible} zIndex={zIndexMap['--zindex-trade-pc-modal'] + 2}>
        <ModalTitle title={title} onClose={onClose} />
        {content}
        <ModalFooter onConfirm={_onConfirm} />
      </Modal>
      {styles}
    </>
  );
};
