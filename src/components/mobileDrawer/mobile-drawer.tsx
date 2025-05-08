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
  const { onClose, open, children, direction = 'right', title, ...reset } = props;
  if (!open) return null;
  return (
    <Drawer
      placement={direction}
      onClose={onClose}
      closable={false}
      title={<div className="customer-mobileo-title">{title}</div>}
      open={open}
      keyboard
      rootClassName="customer-mobile-drawer"
      {...reset}
      extra={<CommonIcon name="common-modal-close" size={16} onClick={()=>onClose()}  />}
    >
      {children}
      <style jsx>{styles}</style>
    </Drawer>
  );
};
const styles = css`
  :global(.customer-mobileo-title) {
    font-family: HarmonyOS Sans SC;
    font-weight: 500;
    font-size: 16px;
    color: var(--text_1);
  }
  :global(.customer-mobile-drawer) {
    z-index: 99999;
    :global(.ant-drawer-content-wrapper) {
      @media ${MediaInfo.mobile} {
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
        border-top-right-radius: 24px;
        border-top-left-radius: 24px;
        background-color: var(--fill_bg_1);
        padding-top: 16px;
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
