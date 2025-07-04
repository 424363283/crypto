import { LANG } from '@/core/i18n';
import { THEME } from '@/core/store';
import { clsx } from '@/core/utils';
import { Modal } from 'antd';
import type { ModalProps } from 'antd/lib/modal';
import css from 'styled-jsx/css';
export type AlertModalProps = {
  title?: string;
  description?: string | React.ReactNode;
  subDescription?: string | React.ReactNode;
  theme?: THEME;
  hideHeaderIcon?: boolean;
} & ModalProps;

export const AlertV3Modal = (props: AlertModalProps) => {
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
      closable={false}
      destroyOnClose
      {...rest}
    >
      {/* {!hideHeaderIcon && (
        <div className='alert-icon'>
          <Image src='/static/images/common/v2_alert_warning.png' alt='' width={54} height={54} />
        </div>
      )} */}
      {renderContent()}
      {styles}
    </Modal>
  );
};
const { className: cssClassName, styles } = css.resolve`
  .alert-modal {
    width: 380px !important;
    :global(.alert-icon) {
      text-align: center;
      padding: 46px 0 34px;
    }
    :global(.alert-content) {
      padding-bottom: 20px;
      text-align: center;
      height: 100%;
      :global(.alert-title) {
        font-size: 16px;
        font-weight: 500;
        text-align: center;
       color: var(--theme-font-color-1);
        margin: 30px 0 16px;
      }
      :global(.alert-description) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
        color: var(--text_2);
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
       background: var(--common-modal-bg);
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
      :global(.ant-btn) {
        height: 40px;
        flex: 1 1;
        border: none;
        font-weight: 600;
        margin: 0;
        width: 165px;
        margin-right: 10px;
      }
      :global(.ant-btn:nth-child(1)) {
        display: none;
        background: var(--theme-sub-button-bg) !important;
        color: var(--theme-font-color-1) !important;
      }
      :global(.ant-btn:nth-child(2)) {
        margin-inline-start: 0;
        margin-right: 0px;
       color: var(--text_white);
    background: var(--brand);
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
      padding: 0 20.5px 32px;
    }
    :global(.ant-modal-content),
    :global(.ant-modal-body) {
      background: var(--common-modal-bg);
      color: var(--text_2);
    }
    :global(.ant-modal-footer) {
      background: var(--theme-background-color-2);
    }
  }
`;
