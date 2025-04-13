import { MediaInfo, clsxWithScope } from '@/core/utils';
import { Drawer } from 'antd';
import { ReactNode } from 'react';
import css from 'styled-jsx/css';
import { ModalClose } from './';

const DrawerModal = ({
  onClose,
  open,
  title,
  renderTitle,
  children,
  contentClassName,
}: {
  onClose: any;
  open: any;
  title?: string;
  renderTitle?: () => ReactNode;
  children: ReactNode;
  contentClassName?: any;
}) => {
  return (
    <>
      <Drawer
        placement='right'
        onClose={onClose}
        open={open}
        closeIcon={<ModalClose className={clsx('drawer-close')} onClose={onClose} />}
        keyboard
        style={{ position: 'relative' }}
        rootClassName={clsx('mobile-drawer')}
      >
        {renderTitle?.() || <div className={clsx('title')}>{title}</div>}
        <div className={clsx('content', contentClassName)}>{children}</div>
      </Drawer>
      {styles}
    </>
  );
};

const { styles, className } = css.resolve`
  .mobile-drawer {
    .title {
      color: var(--theme-font-color-1);
      position: absolute;
      top: 18px;
      left: 19px;
      font-size: 16px;
      font-weight: 500;
    }
    .content {
      padding: 0 16px;
      overflow: auto;
    }
    .drawer-close {
      position: relative;
      z-index: 1;
      height: 24px;
      width: 24px;
    }
    :global(.ant-drawer-content-wrapper) {
      @media ${MediaInfo.mobile} {
        width: 100% !important;
      }
    }
    :global(.ant-drawer-header) {
      border-bottom: none;
      padding: 16px 4px 16px;
      :global(.ant-drawer-header-title) {
        justify-content: end;
      }
    }
    :global(.ant-drawer-body) {
      padding: 0;
    }
    :global(.ant-drawer-content) {
      background: var(--fill-pop);
    }
  }
`;
const clsx = clsxWithScope(className);
export default DrawerModal;
