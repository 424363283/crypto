import { LANG } from '@/core/i18n';
import { zIndexMap } from '@/core/styles/src/theme/global/z-index';
import { clsx } from '@/core/utils';
import { Modal } from 'antd';
import type { ModalProps } from 'antd/lib/modal';
import css from 'styled-jsx/css';
import { AlertModal } from './';
import CommonIcon from '../common-icon';

export type BasicProps = {
  type?: 'alert' | 'confirm';
  title?: string;
  hasCancel?: boolean;
  hasFooter?: boolean;
  description?: string;
  onOk?: () => void;
  onCancel?: () => void;
} & ModalProps;

const BasicModal = (props: BasicProps) => {
  const {
    type = 'confirm',
    children,
    okText = LANG('确定'),
    cancelText = LANG('取消'),
    className,
    hasCancel = true,
    hasFooter = true,
    onOk,
    onCancel,
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
      closeIcon={
        <CommonIcon name="common-close-0" size={14} onClick={onCancel} />
        // <Svg src={'/static/icons/primary/common/close.svg'} width={14} fill='var(--text_1)' onClick={onCancel} />
      }
      footer={
        hasFooter ? (
          <div className="footer-btn">
            {hasCancel && (
              <>
                <div className="ant-btn" onClick={onCancel}>
                  {cancelText}
                </div>
                <div style={{ width: '10px' }} />
              </>
            )}
            <div className="ant-btn" onClick={onOk}>
              {okText}
            </div>
          </div>
        ) : null
      }
      {...rest}
    >
      <div className="basic-content"> {children}</div>
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
      border-radius: 24px;
      background-color: var(--common-modal-bg);
      :global(.ant-modal-header) {
        background-color: var(--common-modal-bg);
      }
      :global(.ant-modal-title) {
        padding: 0 20px;
        color: var(--text_1);
        font-size: 16px;
        font-weight: 500;
        padding-bottom: 20px;
        // border-bottom: 1px solid var(--skin-border-color-1);
      }
      :global(.basic-content) {
        padding: 8px 20px;
      }
      :global(.ant-modal-footer) {
        padding: 0px 20px;
        display: flex;
        gap: 10px;
        .footer-btn {
          display: flex;
          width: 100%;
          .ant-btn {
            flex: 1;
            text-align: center;
            line-height: 48px;
            height: 48px;
          }
        }
        :global(.ant-btn) {
          flex: 1 1;
          height: 40px;
          border: none;
          font-weight: 600;
          cursor: pointer;
        }
        :global(.ant-btn:nth-child(1)) {
          background: var(--theme-background-color-13);
          color: var(--theme-font-color-1);
          border: 1px solid var(--skin-border-color-1);
          border-radius: 30px;
        }
        :global(.ant-btn:last-child) {
          background: var(--brand);
          color: var(--text_white);
          margin-left: 0px;
          border-radius: 30px;
          &:hover {
            background-color: var(--brand);
          }
        }
        :global(.ant-btn-primary:disabled) {
          color: var(--skin-font-color);
          background-color: var(--brand);
          box-shadow: none;
          opacity: 0.5;
        }
      }
    }
    :global(.ant-modal-close) {
      top: 15px;
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
