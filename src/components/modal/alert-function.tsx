import { LANG } from '@/core/i18n';
import { LOCAL_KEY, THEME, localStorageApi } from '@/core/store';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AlertModal } from './';
import { AlertModalProps } from './alert';
import { AlertV2Modal } from './alert_v2';
import { AlertV3Modal } from './alert_v3';
import { AlertV4Modal } from './alert_v4';

type AlertFuncProps = {
  title?: string;
  content?: string | React.ReactNode;
  onOk?: () => void;
  onCancel?: () => void;
  width?: number;
  className?: string;
  okText?: string;
  cancelText?: string;
  theme?: THEME;
  hideHeaderIcon?: boolean;
  subDescription?: string | React.ReactNode;
  v2?: boolean;
  v3?: boolean;
  v4?: boolean;
} & AlertModalProps;

export const AlertFunction = (props: AlertFuncProps) => {
  const {
    title,
    content,
    onOk,
    okText = LANG('确定'),
    cancelText = LANG('取消'),
    onCancel,
    width,
    className,
    subDescription,
    v2,
    v3,
    v4,
    ...rest
  } = props;
  const div = document.createElement('div');
  const root = createRoot(div);
  document.body.appendChild(div);
  const theme = localStorageApi.getItem(LOCAL_KEY.THEME) as THEME;
  const onClose = () => {
    root.unmount();
    div.remove();
  };

  const handleOk = () => {
    onClose();
    onOk && onOk();
  };

  const handleCancel = () => {
    onClose();
    onCancel && onCancel();
  };
  root.render(
    <>
      {!v2 && !v3 && !v4 && (
        <AlertModal
          title={title}
          width={width}
          okText={okText}
          cancelText={cancelText}
          className={className}
          open={true}
          description={content}
          onOk={handleOk}
          onCancel={handleCancel}
          destroyOnClose
          hideHeaderIcon
          {...rest}
        />
      )}
      {v2 && (
        <AlertV2Modal
          title={title}
          width={width}
          okText={okText}
          cancelText={cancelText}
          className={className}
          open={true}
          description={content}
          onOk={handleOk}
          onCancel={handleCancel}
          subDescription={subDescription}
          destroyOnClose
          {...rest}
        />
      )}
      {v3 && (
        <AlertV3Modal
          title={title}
          width={width}
          okText={okText}
          cancelText={cancelText}
          className={className}
          open={true}
          description={content}
          onOk={handleOk}
          onCancel={handleCancel}
          subDescription={subDescription}
          destroyOnClose
          {...rest}
        />
      )}
      {v4 && (
        <AlertV4Modal
          title={title}
          width={width}
          okText={okText}
          cancelText={cancelText}
          className={className}
          open={true}
          description={content}
          onOk={handleOk}
          onCancel={handleCancel}
          subDescription={subDescription}
          destroyOnClose
          {...rest}
        />
      )}
    </>
  );
};
