import { LANG } from '@/core/i18n';
import { zIndexMap } from '@/core/styles/src/theme/global/z-index';
import { clsx } from '@/core/utils';
import { Modal } from 'antd';
import type { ModalProps } from 'antd/lib/modal';
import css from 'styled-jsx/css';
import CommonIcon from '../common-icon';
import { AlertModal } from './';

export type BasicProps = {
  type?: 'alert' | 'confirm';
  title?: string;
  description?: string;
} & ModalProps;

const BasicModal = (props: BasicProps) => {
  const {
    type = 'confirm',
    children,
    okText = LANG('确定'),
    cancelText = LANG('取消'),
    className,
    open,
    ...rest
  } = props;
  if (type === 'alert') {
    return <AlertModal {...props} />;
  }
  if (!open) return null;
  return (
    <Modal
      className={clsx('basic-modal', className)}
      okText={okText}
      closable
      centered
      open={open}
      cancelText={cancelText}
      zIndex={zIndexMap['--zindex-trade-pc-modal']}
      closeIcon={<CommonIcon name='common-close-filled' size={24} enableSkin />}
      {...rest}
    >
      <div className='basic-content'> {children}</div>
      <style jsx>{styles}</style>
    </Modal>
  );
};
const styles = css`
  :global(.basic-modal) {
    z-index: ${zIndexMap['--zindex-trade-pc-modal']};
    :global(.ant-modal-content) {
      padding-left: 0;
      padding-right: 0;
      background-color: var(--theme-background-color-2);
      :global(.ant-modal-header) {
        background-color: var(--theme-background-color-2);
      }
      :global(.ant-modal-title) {
        padding: 0 20px;
        color: var(--theme-font-color-1);
        font-size: 16px;
        padding-bottom: 22px;
        border-bottom: 1px solid var(--skin-border-color-1);
      }
      :global(.basic-content) {
        padding: 8px 20px;
      }
      :global(.ant-modal-footer) {
        padding: 0px 20px;
        display: flex;
        gap: 10px;
        :global(.ant-btn) {
          flex: 1 1;
          height: 40px;
          border: none;
          font-weight: 600;
        }
        :global(.ant-btn:nth-child(1)) {
          background: var(--theme-background-color-13);
          color: var(--theme-font-color-1);
          border: 1px solid var(--skin-border-color-1);
        }
        :global(.ant-btn:nth-child(2)) {
          background: var(--skin-primary-color);
          color: var(--skin-font-color);
          margin-left: 0px;
          &:hover {
            background-color: var(--skin-primary-color);
          }
        }
        :global(.ant-btn-primary:disabled) {
          color: var(--skin-font-color);
          background-color: var(--skin-primary-color);
          box-shadow: none;
          opacity: 0.5;
        }
      }
    }
    :global(.ant-modal-close:hover) {
      background-color: inherit;
    }
  }
  :global(.base-drop-view) {
    z-index: 10001 !important;
  }
`;
export default BasicModal;
