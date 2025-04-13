import Image from '@/components/image';
import { LANG } from '@/core/i18n';
import { LOCAL_KEY, THEME } from '@/core/store';
import { clsx } from '@/core/utils';
import { Modal } from 'antd';
import type { ModalProps } from 'antd/lib/modal';
import css from 'styled-jsx/css';

export type AlertModalProps = {
  title?: string;
  description?: string | React.ReactNode;
  theme?: THEME;
  hideHeaderIcon?: boolean;
  placeBottom?: boolean;
} & ModalProps;

const AlertModal = (props: AlertModalProps) => {
  const {
    className,
    children,
    title,
    description,
    okText = LANG('确认'),
    cancelText = LANG('取消'),
    theme = 'light',
    hideHeaderIcon = false,
    placeBottom = false, // 移动端置底部，centered需要为false
    ...rest
  } = props;
  const isDark = theme === 'dark';
  const skin = document.documentElement.getAttribute(LOCAL_KEY.DATA_SKIN) || '';
  const isBlue = skin === 'blue';

  // 组件内部新创建的节点，无法获取到 appContext 的更新
  const closeIconSrc = isDark
    ? isBlue
      ? '/static/icons/blue/common/dark/close-filled.svg'
      : '/static/icons/primary/common/dark/close-filled.svg'
    : isBlue
    ? '/static/icons/blue/common/close-filled.svg'
    : '/static/icons/primary/common/close-filled.svg';

  const renderContent = () => {
    if (children) return children;
    return (
      <div className='alert-content'>
        {title && <div className='alert-title'>{title}</div>}
        {description && <div className='alert-description'>{description}</div>}
      </div>
    );
  };
  return (
    <Modal
      className={clsx('alert-modal', className, placeBottom && 'place-bottom')}
      okText={okText}
      cancelText={cancelText}
      closable
      destroyOnClose
      closeIcon={<Image src={closeIconSrc} width={32} height={32} />}
      {...rest}
    >
      {!hideHeaderIcon && (
        <div className='alert-title'>
          <Image src='/static/images/common/verify_fail.svg' alt='' width={57} height={57} enableSkin />
        </div>
      )}
      {renderContent()}
      <style jsx>{styles}</style>
    </Modal>
  );
};
const styles = css`
  :global(.alert-modal) {
    text-align: center;
    :global(.alert-content) {
      height: 100%;
      :global(.alert-title) {
        font-size: 15px;
        font-weight: 600;
        color: var(--theme-font-color-1);
        padding: 10px 0 10px;
      }
      :global(.alert-description) {
        font-size: 15px;
        font-weight: normal;
        color: var(--theme-font-color-1);
        margin-bottom: 20px;
      }
    }
    :global(.ant-modal-content) {
      background-color: var(--theme-background-color-2);
    }
    :global(.ant-modal-body) {
      margin-top: 20px;
      min-height: 64px;
      text-align: center;
    }
    :global(.ant-modal-footer) {
      display: flex;
      justify-content: center;
      :global(.ant-btn) {
        height: 40px;
        flex: 1 1;
        border: none;
        font-weight: 600;
      }
      :global(.ant-btn:nth-child(1)) {
        background-color: var(--theme-background-color-2);
        color: var(--theme-font-color-1);
        border: 1px solid var(--theme-border-color-2);
        border-radius:30px;
      }
      :global(.ant-btn:nth-child(2)) {
        background: var(--brand);
        color: var(--skin-font-color);
        border-radius:30px;
      }
      :global(.ant-btn-primary:disabled) {
        cursor: not-allowed;
        border-color: #d9d9d9;
        color: rgba(0, 0, 0, 0.25);
        background-color: rgba(0, 0, 0, 0.04);
        box-shadow: none;
        opacity: 0.5;
      }
    }
  }
  :global(.alert-modal.place-bottom) {
    position: fixed;
    bottom: 0;
    top: auto;
    left: 0;
    right: 0;
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding-bottom: 0px;

    :global(.ant-modal-content) {
      height: auto;
      border-radius: 16px 16px 0 0;
      width: 100%;
      max-width: 100%;
      padding: 30px 10px 28px;
    }

    :global(.ant-modal-footer) {
      display: flex;
      justify-content: center;
    }
  }
`;
export default AlertModal;
