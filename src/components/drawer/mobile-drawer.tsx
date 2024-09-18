import { MediaInfo } from '@/core/utils';
import type { DrawerProps } from 'antd';
import { Drawer } from 'antd';
import css from 'styled-jsx/css';
import CommonIcon from '../common-icon';

interface MobileDrawerProps extends DrawerProps {
  onClose: () => void;
  children: React.ReactNode;
}
const MobileDrawer = (props: MobileDrawerProps) => {
  const { onClose, open, children, ...reset } = props;
  if (!open) return null;
  return (
    
    <Drawer
      placement='right'
      onClose={onClose}
      open={open}
      closeIcon={<CommonIcon name='common-close-filled' size={24} enableSkin />}
      keyboard
      rootClassName='common-mobile-drawer'
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
        width: 100% !important;
        :global(.ant-tabs-nav::before) {
          border-bottom: 1px solid rgba(5, 5, 5, 0.06);
        }
      }
      :global(.ant-drawer-header) {
        padding: 28px 4px 0px;
        border-bottom: none;
        :global(.ant-drawer-header-title) {
          justify-content: end;
        }
      }
      :global(.ant-drawer-content) {
        background-color: var(--theme-background-color-2);
      }
      :global(.ant-drawer-body) {
        display: flex;
        flex-direction: column;
        padding-top: 0;
      }
    }
  }
`;
export default MobileDrawer;
