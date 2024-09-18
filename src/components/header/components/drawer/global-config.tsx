import { MobileDrawer } from '@/components/drawer';
import css from 'styled-jsx/css';

interface GlobalConfigProps {
  onClose: () => void;
  open: boolean;
  children: React.ReactNode;
}
const GlobalConfigDrawer = (props: GlobalConfigProps) => {
  const { onClose, open, children } = props;
  if (!open) return null;
  return (
    <MobileDrawer placement='right' onClose={onClose} open={open} keyboard destroyOnClose>
      {children}
      <style jsx>{styles}</style>
    </MobileDrawer>
  );
};
const styles = css`
  :global(.ant-drawer-content-wrapper) {
    :global(.ant-drawer-content) {
      :global(.ant-tabs-nav .ant-tabs-tab .ant-tabs-tab-btn) {
        color: var(--theme-font-color-1);
      }
      :global(.ant-tabs-nav .ant-tabs-tab-active .ant-tabs-tab-btn) {
        color: var(--skin-hover-font-color);
        font-weight: 500;
      }
      :global(.ant-drawer-body) {
        padding: 0 24px 24px;
        :global(.ant-tabs-nav .ant-tabs-nav-list .ant-tabs-ink-bar) {
          overflow: hidden;
          background-color: var(--skin-hover-font-color);
        }
        :global(.ant-tabs-content .fiat-list) {
          flex-direction: column;
        }
      }
    }
    :global(.ant-drawer-body .list) {
      flex-direction: column;
      color: var(--theme-font-color-1);
    }
  }
`;
export default GlobalConfigDrawer;
