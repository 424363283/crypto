import React from 'react';
import { Modal } from 'antd';
import styles from './index.module.scss';
import clsx from 'clsx';

export { Header } from './Header';

function BvModal({
  open,
  header,
  headerStyle,
  headerClassName,
  content,
  contentStyle,
  contentClassName,
  footer,
  footerStyle,
  footerClassName,
  overlayClassName,
  ...otherProps
}: any) {
  return (
    <Modal
      width={400}
      centered
      {...otherProps}
      open={open}
      closable={false}
      footer={null}
      title={null}
      className={clsx(styles.antdModalWrap, overlayClassName)}
    >
      {header ? (
        <div className={clsx(styles.modalHeader, headerClassName)} style={headerStyle}>
          {header}
        </div>
      ) : null}

      <div className={clsx(styles.modalContent, contentClassName)} style={contentStyle}>
        {content}
      </div>

      {footer ? (
        <div className={clsx(styles.modalFooter, footerClassName)} style={footerStyle}>
          {footer}
        </div>
      ) : null}
    </Modal>
  );
}

export default BvModal;
