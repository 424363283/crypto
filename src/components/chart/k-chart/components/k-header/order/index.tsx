import CommonIcon from '@/components/common-icon';
import { Switch } from '@/components/switch';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { LANG } from '@/core/i18n';
import { clsxWithScope, isSwapDemo } from '@/core/utils';
import { Dropdown } from 'antd';
import { useCallback, useState } from 'react';
import css from 'styled-jsx/css';

export const KlineHeaderActionOrders = ({ store }: { store: any }) => {
  const [visible, setVisible] = useState(false);
  const isDemo = isSwapDemo();
  const active = visible ? true : false;
  const _handleVisible = useCallback(() => setVisible((v) => !v), []);

  const overlay = (
    <div className={clsx('menus')}>
      <div>
        <div>{LANG('当前委托')}</div>
        <div>
          <Switch
            checked={store.setting.pendingOrder}
            bgType={2}
            onChange={(v) => (store.setting = { ...store.setting, pendingOrder: v })}
            size='small'
          />
        </div>
      </div>
      <div>
        <div>{LANG('仓位信息')}</div>
        <div>
          <Switch
            checked={store.setting.positionOrder}
            bgType={2}
            onChange={(v) => (store.setting = { ...store.setting, positionOrder: v })}
            size='small'
          />
        </div>
      </div>
      {!isDemo && (
        <div>
          <div>{LANG('买卖打点')}</div>
          <div>
            <Switch
              checked={store.setting.transactionManagement}
              bgType={2}
              onChange={(v) => (store.setting = { ...store.setting, transactionManagement: v })}
              size='small'
            />
          </div>
        </div>
      )}
    </div>
  );
  return (
    <>
      <Dropdown
        menu={{ items: [] }}
        dropdownRender={(menu) => overlay}
        open={visible}
        onOpenChange={_handleVisible}
        trigger={['click']}
        placement='bottomLeft'
        overlayClassName={clsx('dropdown-select-overlay')}
      >
        <Tooltip title={LANG('显示设置')}>
          <div className={clsx('action')} onClick={() => {}}>
            {active ? (
              <CommonIcon name='common-order-setting-active-0' size={12} enableSkin />
            ) : (
              <CommonIcon name='common-order-setting-0' size={12} />
            )}
          </div>
        </Tooltip>
      </Dropdown>

      {styles}
    </>
  );
};

const { className, styles } = css.resolve`
  .dropdown-select-overlay {
    z-index: 100001;
  }
  .action {
    min-width: 12px;
    margin-left: 10px;
    padding-left: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .menus {
    width: 227px;
    background: var(--theme-trade-modal-color);
    box-shadow: var(--theme-trade-select-shadow);
    border-radius: 4px;
    top: 100%;
    padding: 10px;
    border-radius: 10px;
    right: 0;
    min-width: 59px;
    position: relative;
    top: 12px;
    max-height: 250px;
    overflow: auto;
    > :global(div) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      :global(div) {
        font-size: 12px;
        color: var(--theme-font-color-1);
      }

      &:last-child {
        margin-bottom: 0px;
      }
    }
  }
`;
const clsx = clsxWithScope(className);
