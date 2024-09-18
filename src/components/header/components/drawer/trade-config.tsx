import { DrawerModal } from '@/components/mobile-modal';
import { PreferenceMenu } from '@/components/trade-ui/trade-view/swap/components/preference-menu';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { clsxWithScope, isSwapTradePage } from '@/core/utils';
import css from 'styled-jsx/css';

import { useState } from 'react';
import { ConfigMenu } from '../config-menu';

interface ConfigDrawerProps {
  onClose: () => void;
  open: boolean;
}
// src/components/trade-ui/trade-view/swap/components/preference-menu
const TradeConfigDrawer = (props: ConfigDrawerProps) => {
  const _isSwapTradePage = isSwapTradePage();
  const [index, setIndex] = useState(_isSwapTradePage ? 0 : 1);
  const { onClose, open } = props;
  const { isUsdtType } = Swap.Trade.base;

  return (
    <>
      <DrawerModal
        renderTitle={() => (
          <div className={clsx('trade-config-title')}>
            {_isSwapTradePage && (
              <div className={clsx(index === 0 && 'active')} onClick={() => setIndex(0)}>
                {isUsdtType ? LANG('U本位偏好设置') : LANG('币本位偏好设置')}
              </div>
            )}
            <div className={clsx(index === 1 && 'active')} onClick={() => setIndex(1)}>
              {LANG('界面设置')}
            </div>
          </div>
        )}
        open={open}
        onClose={onClose}
        contentClassName={clsx('drawer-content')}
      >
        {index === 0 ? <PreferenceMenu onlyContent /> : <ConfigMenu />}
      </DrawerModal>
      {styles}
    </>
    // <MobileDrawer onClose={onClose} open={open} className='config-drawer'>
    // </MobileDrawer>
  );
};
const { className, styles: _styles } = css.resolve`
  .drawer-content {
    padding: 0 !important;
  }
  .trade-config-title {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    color: var(--theme-font-color-3);
    height: 60px;
    border-bottom: 1px solid var(--skin-border-color-1);
    > div {
      cursor: pointer;
      white-space: nowrap;
      font-size: 16px;
      margin-left: 16px;
      font-weight: 500;
      display: flex;
      align-items: center;
      border-bottom: 2px solid transparent;
      &.active {
        color: var(--theme-font-color-1);
        border-bottom: 2px solid var(--skin-primary-color);
      }
      &:first-child {
        margin-left: 18px;
      }
    }
  }
`;

const styles = _styles;
const clsx = clsxWithScope(className);

export default TradeConfigDrawer;
