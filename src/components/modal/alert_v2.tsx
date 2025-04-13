import { LANG } from '@/core/i18n';
import { THEME } from '@/core/store';
import { clsx } from '@/core/utils';
import { Modal } from 'antd';
import type { ModalProps } from 'antd/lib/modal';
import Image from 'next/image';
import css from 'styled-jsx/css';
export type AlertModalProps = {
  title?: string;
  description?: string | React.ReactNode;
  subDescription?: string | React.ReactNode;
  theme?: THEME;
  hideHeaderIcon?: boolean;
} & ModalProps;

export const AlertV2Modal = (props: AlertModalProps) => {
  const {
    className,
    children,
    title,
    description,
    subDescription,
    okText = LANG('确认'),
    cancelText = LANG('取消'),
    theme = 'light',
    hideHeaderIcon = false,
    closable = false,
    ...rest
  } = props;

  const renderContent = () => {
    if (children) return children;
    return (
      <div className='alert-content'>
        {title && <div className='alert-title'>{title}</div>}
        {description && <div className='alert-description'>{description}</div>}
        {subDescription && <div className='alert-sub-description'>{subDescription}</div>}
      </div>
    );
  };
  return (
    <Modal
      className={clsx('alert-modal', cssClassName, className)}
      okText={okText}
      cancelText={cancelText}
      centered
      closable={closable}
      destroyOnClose
      {...rest}
    >
      {!hideHeaderIcon && (
        <div className='alert-icon'>
          <Image src='/static/images/common/v2_alert_warning.png' alt='' width={54} height={54} />
        </div>
      )}
      {renderContent()}
      {styles}
    </Modal>
  );
};
const { className: cssClassName, styles } = css.resolve`
  .alert-modal {
    width: 480px !important;
    :global(.alert-icon) {
      text-align: center;
      padding: 16px 0 4px;
    }
    :global(.alert-content) {
      padding-bottom: 2px;
      text-align: center;
      height: 100%;
      margin-top:16px;
      :global(.alert-title) {
        font-size: 16px;
        font-weight: 500;
        text-align: center;
        color: var(--theme-font-color-1);
        margin-bottom: 1px;
      }
      :global(.alert-description) {
        text-align: left;
        color: var(--theme-font-color-1);
        font-size: 12px;
        font-weight: normal;
      }
      :global(.alert-sub-description) {
        border-radius: 6px;
        background: rgba(255, 211, 15, 0.1);
        padding: 10px;
        text-align: left;
        margin-top: 16px;
        color: var(--theme-hover-font-color);
        font-size: 12px;
        font-weight: normal;
      }
    }
    :global(.ant-modal-header) {
      background: var(--fill-pop);
    }
    :global(.ant-modal-body) {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    :global(.ant-modal-footer) {
      padding: 0px;
      display: flex;
      justify-content: center;
      margin-top:48px;
      :global(.ant-btn) {
        height: 48px;
        flex: 1 1;
        border: none;
        font-weight: 600;
        margin: 0;
        width: 165px;
        margin-right: 10px;
      }
      :global(.ant-btn:nth-child(1)) {
        background: var(--theme-sub-button-bg) !important;
        color: var(--theme-font-color-1) !important;
      }
      :global(.ant-btn:nth-child(2)) {
        margin-inline-start: 0;
        margin-right: 0px;
        background: var(--text-brand);
        color:#fff;
      }
      :global(.ant-btn-primary:disabled) {
        cursor: not-allowed;
        border-color: #d9d9d9;
        color: var(--theme-font-color-2);
        background-color: var(--theme-background-color-disabled);
        box-shadow: none;
        opacity: 0.5;
      }
    }
    :global(.ant-modal-content) {
      padding: 0 20.5px 12px;
    }
    :global(.ant-modal-content),
    :global(.ant-modal-body) {
    background: var(--fill-pop);
      color: var(--theme-font-color-1);
    }
    :global(.ant-modal-footer) {
    background: var(--fill-pop);
    }
  }
`;
