import { MediaInfo } from '@/core/utils';

import type { DrawerProps } from 'antd';
import { Drawer } from 'antd';
import css from 'styled-jsx/css';
import CommonIcon from '../common-icon';

interface MobileDrawerProps extends DrawerProps {
  onClose: () => void;
  children: React.ReactNode;
  direction?: DrawerProps['placement'];
}
const MobileDrawer = (props: MobileDrawerProps) => {
  const { onClose, open, children,  direction = 'right', ...reset } = props;
  if (!open) return null;
  return (
    <Drawer
      placement={ direction }
      onClose={onClose}
      open={open}
      closeIcon={<CommonIcon name="common-modal-close" size={16} enableSkin />}
      keyboard
      rootClassName="common-mobile-drawer"
      {...reset}
    >
      {children}
      <style jsx>{styles}</style>
    </Drawer>
  );
};
const styles = css`
  :global(.common-mobile-drawer) {
    z-index: 99999;
    :global(.ant-drawer-content-wrapper) {
      @media ${MediaInfo.mobile} {
        width: 80% !important;
        :global(.ant-tabs-nav::before) {
          border-bottom: 1px solid rgba(5, 5, 5, 0.06);
        }
      }
      :global(.ant-drawer-header) {
        padding: 0 1rem;
        border-bottom: none;
        :global(.ant-drawer-header-title) {
          justify-content: end;
          height: 2.75rem;
          :global(.ant-drawer-close) {
            margin: 0;
            padding: 0;
            justify-content: flex-end;
          }
        }
      }
      :global(.ant-drawer-content) {
        background-color: var(--bg-1);
      }
      :global(.ant-drawer-body) {
        display: flex;
        flex-direction: column;
        padding: 0 1rem;
      }
    }
  }
`;
export default MobileDrawer;
