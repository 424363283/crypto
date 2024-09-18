import { BasicModal as Modal } from '@/components/modal';
import { Button } from '@/components/trade-ui/trade-view/components/button';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';

import CommonIcon from '@/components/common-icon';
import { Svg } from '@/components/svg';
import { ModalProps } from 'antd';
import { debounce } from 'lodash';
import React, { ReactNode, useMemo } from 'react';
import { clsx, styles } from './styled';

const Index = ({
  className,
  contentClassName,
  modalContentClassName,
  onClose,
  visible,
  children,
  isDark: _isDark,
  width,
  zIndex,
  getContainer,
  rootClassName,
  centered = true,
}: {
  className?: any;
  contentClassName?: any;
  modalContentClassName?: any;
  onClose?: any;
  visible?: any;
  children?: any;
  isDark?: any;
  width?: any;
  zIndex?: number;
  rootClassName?: string;
  centered?: boolean;
  getContainer?: ModalProps['getContainer'];
}) => {
  const { isDark: stateIsDark } = useTheme();
  const isDark = _isDark === undefined ? stateIsDark : _isDark;

  return (
    <>
      <Modal
        className={clsx('swap-common-modal', className)}
        rootClassName={rootClassName}
        onCancel={onClose}
        open={visible}
        centered={centered}
        closable={false}
        maskClosable
        width={width}
        zIndex={zIndex}
        footer={false}
        getContainer={getContainer}
      >
        <div className={clsx('swap-common-modal-content', contentClassName, !isDark && 'light')}>
          {React.Children.map(children, (child, index) => {
            if (index == 1) {
              return <ModalContent className={modalContentClassName}>{child}</ModalContent>;
            }
            return child;
          })}
        </div>
      </Modal>
      {styles}
    </>
  );
};

export const ModalTitle = ({
  closable = true,
  title,
  className,
  closeClassName,
  onClose,
  fullBorder = true,
  border = false,
  fullHeight = false,
  titleInfo,
}: {
  closable?: any;
  title?: any;
  className?: any;
  closeClassName?: any;
  onClose?: any;
  fullBorder?: any;
  fullHeight?: any;
  titleInfo?: Function;
  border?: any;
}) => {
  return (
    // <div className={clsx('modal-title', 'border', fullBorder && 'full-border', className)}>
    <div
      className={clsx(
        'modal-title',
        border && 'border',
        (fullHeight || border) && 'bottom-padding',
        fullBorder && 'full-border',
        titleInfo && 'pointer',
        className
      )}
    >
      <div className={clsx('modal-title-content')}>
        <span onClick={() => titleInfo?.()}> {title}</span>
        {titleInfo && (
          // <Tooltip title={titleInfo} placement='topLeft'>
          <div className={clsx('tooltip')} onClick={() => titleInfo?.()}>
            <Svg className={clsx('icon')} src='/static/images/swap/tips_info.svg' height={12} width={12} />
          </div>
          // </Tooltip>
        )}
        {closable && <ModalClose className={closeClassName} onClose={onClose} />}
      </div>
    </div>
  );
};
export const ModalContent = ({ children, className }: { children: ReactNode; className?: any }) => {
  return <div className={clsx('swap-common-modal-content-component', className, 'hide-scroll-bar')}>{children}</div>;
};
export const ModalTabsTitle = ({
  closable = true,
  titles,
  index,
  onChange,
  className,
  closeClassName,
  onClose,
}: {
  closable?: any;
  index: number;
  onChange: any;
  titles?: any[];
  className?: any;
  closeClassName?: any;
  onClose?: any;
}) => {
  return (
    // <div className={clsx('modal-title', 'border', fullBorder && 'full-border', className)}>
    <div className={clsx('modal-title', 'border', 'tabs', className)}>
      <div className={clsx('modal-title-content')}>
        <div className={clsx('tabs-content')}>
          {titles?.map((v, i) => (
            <div key={i} className={clsx(i === index && 'active')} onClick={() => onChange(i)}>
              {v}
            </div>
          ))}
        </div>
        {closable && <ModalClose className={closeClassName} onClose={onClose} />}
      </div>
    </div>
  );
};

export const ModalClose = ({ className, onClose, size = 24 }: { className?: string; onClose?: any; size?: any }) => {
  return (
    <>
      <div className={clsx('close-wrapper', className)}>
        <div className={clsx('close', className)} onClick={onClose}>
          <CommonIcon name='common-close-filled' size={size} enableSkin />
        </div>
      </div>
      {styles}
    </>
  );
};

export const ModalFooter = ({
  onConfirm,
  onCancel,
  disabledConfirm,
  cancel = false,
  confirmText,
}: {
  onConfirm?: any;
  onCancel?: any;
  disabledConfirm?: any;
  cancel?: boolean;
  confirmText?: string;
}) => {
  const _onConfirm = useMemo(() => debounce(onConfirm, 200), [onConfirm]);

  return (
    <div className={clsx('modal-footer', !cancel && 'single')}>
      {cancel && (
        <Button onClick={onCancel} className={clsx('cancel')}>
          {LANG('取消')}
        </Button>
      )}
      <Button
        onClick={disabledConfirm ? undefined : _onConfirm}
        className={clsx('confirm', disabledConfirm ? 'disabled' : '')}
      >
        {confirmText || LANG('确定')}
      </Button>
    </div>
  );
};

export default Index;
