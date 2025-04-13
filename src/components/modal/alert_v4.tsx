import { LANG } from '@/core/i18n';
import { THEME } from '@/core/store';
import { clsx, MediaInfo } from '@/core/utils';
import { Modal } from 'antd';
import type { ModalProps } from 'antd/lib/modal';
import Image from 'next/image';
import css from 'styled-jsx/css';
import { Button } from '@/components/button';
import { Size } from '../constants';
export type AlertModalProps = {
  title?: string;
  description?: string | React.ReactNode;
  subDescription?: string | React.ReactNode;
  theme?: THEME;
  hideHeaderIcon?: boolean;
} & ModalProps;

export const AlertV4Modal = (props: AlertModalProps) => {
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
    onOk,
    ...rest
  } = props;

  const renderContent = () => {
    if (children) return children;
    return (
      <div className="alert-content">
        {description && <div className="alert-description">{description}</div>}
        {subDescription && <div className="alert-sub-description">{subDescription}</div>}
      </div>
    );
  };
  return (
    <Modal
      className={clsx('alert-modal', cssClassName, className)}
      title={title}
      okText={okText}
      cancelText={cancelText}
      centered
      destroyOnClose
      footer={
        <Button type="primary" size={Size.LG} rounded style={{ width: '100%' }} onClick={onOk}>
          {okText}
        </Button>
      }
      {...rest}
    >
      {renderContent()}
      {styles}
    </Modal>
  );
};
const { className: cssClassName, styles } = css.resolve`
  .alert-modal {
    @media ${MediaInfo.mobile} {
      padding: 0 1rem;
    }
    :global(.ant-modal-close) {
      top: 16px;
      color: var(--text-secondary);
    }
    :global(.alert-icon) {
      text-align: center;
      padding: 16px 0 4px;
    }
    :global(.alert-content) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-top: 40px;
      @media ${MediaInfo.mobile} {
        margin-top: 1rem;
      }
      :global(.alert-title) {
        font-size: 16px;
        font-weight: 500;
        text-align: center;
        color: var(--theme-font-color-1);
        margin-bottom: 1px;
      }
      :global(.alert-description) {
        color: var(--text-secondary);
        font-size: 14px;
        font-weight: 400;
        line-height: 150%; /* 21px */
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
      color: var(--text-primary);
      background: var(--common-modal-bg);
      @media ${MediaInfo.mobile} {
        background: var(--fill-1);
      }
      margin-bottom: 0;
      :global(.ant-modal-title) {
        color: var(--text-primary);
        text-align: justify;
        font-size: 16px;
        font-weight: 500;
      }
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
      margin-top: 40px;
      @media ${MediaInfo.mobile} {
        margin-top: 1rem;
      }
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
        background: var(--theme-sub-button-bg) !important;
        color: var(--theme-font-color-1) !important;
      }
      :global(.ant-btn:nth-child(2)) {
        margin-inline-start: 0;
        margin-right: 0px;
        background: var(--theme-primary-color);
        color: var(--theme-light-text-1);
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
    :global(.ant-modal-content),
    :global(.ant-modal-body) {
      background: var(--common-modal-bg);
      color: var(--text-secondary);
      @media ${MediaInfo.mobile} {
        background: var(--fill-1);
      }
    }
    :global(.ant-modal-content) {
      padding: 24px;
      border-radius: 24px;
    }
    :global(.ant-modal-footer) {
      background: var(--common-modal-bg);
      @media ${MediaInfo.mobile} {
        background: var(--fill-1);
      }
    }
  }
`;
