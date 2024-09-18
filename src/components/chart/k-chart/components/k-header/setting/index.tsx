import CommonIcon from '@/components/common-icon';
import { Svg } from '@/components/svg';
import { LANG } from '@/core/i18n';
import { useAppContext } from '@/core/store';
import { MediaInfo, clsxWithScope } from '@/core/utils';
import { Dropdown } from 'antd';
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import css from 'styled-jsx/css';

const GotoDateModal = dynamic(() => import('./components/goto-date-modal'), { ssr: false, loading: () => <div /> });

export const KlineHeaderActionSetting = ({ store, isSwap }: { store: any; isSwap: boolean }) => {
  const [visible, setVisible] = useState(false);
  const [gotoDateVisible, setGotoDateVisible] = useState(false);
  const { isLogin } = useAppContext();
  const active = visible ? true : false;
  const _handleVisible = useCallback(() => setVisible((v) => !v), []);
  const { setting } = store;
  const options = [];
  if (isSwap && isLogin) {
    options.push([LANG('画线下单'), 'paintOrder']);
  }
  options.push([LANG('盘口价格'), 'orderBookPrice']);
  options.push([LANG('倒计时'), 'countdown']);
  options.push([LANG('市场价格线'), 'newPrice']);
  options.push([LANG('倒垂视角'), 'revesePreview']);
  const overlay = (
    <div className={clsx('menus')}>
      <div className={clsx('top')}>
        {options.map((item, index) => {
          const [label, key] = item;
          const value = setting[key];

          return (
            <div
              key={index}
              className={clsx(value && 'active')}
              onClick={() => (store.setting = { ...store.setting, [key]: !value })}
            >
              <div className={clsx('icon')}>{setting[key] && <CommonIcon name='common-checked-0' size={16} />}</div>
              {label}
            </div>
          );
        })}
      </div>
      {/* <div className={clsx('bottom')}>
        <div
          onClick={() => {
            setGotoDateVisible(true);
            setVisible(false);
          }}
        >
          <div className={clsx('icon')}>
            <CommonIcon name='common-calendar-gray-0' size={16} />
          </div>
          <div>{LANG('前往日期')}</div>
        </div>
      </div> */}
    </div>
  );
  return (
    <>
      <div className={clsx('view')}>
        <Dropdown
          menu={{ items: [] }}
          dropdownRender={(menu) => overlay}
          open={visible}
          onOpenChange={_handleVisible}
          trigger={['click']}
          placement='bottomLeft'
          overlayClassName={clsx('dropdown-select-overlay')}
        >
          <div className={clsx('action')} onClick={() => {}}>
            <Svg
              src={active ? '/static/images/trade/kline/setting_active.svg' : '/static/images/trade/kline/setting.svg'}
              height={12}
            />
          </div>
        </Dropdown>
      </div>
      {styles}
      {gotoDateVisible && <GotoDateModal visible={gotoDateVisible} onClose={() => setGotoDateVisible(false)} />}
    </>
  );
};

const { className, styles } = css.resolve`
  @media ${MediaInfo.mobile} {
    .view {
      display: none;
    }
  }
  .dropdown-select-overlay {
    z-index: 100001;
  }
  .action {
    margin-left: 10px;
    min-width: 12px;
    padding-left: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .menus {
    background: var(--theme-trade-select-bg-color);
    box-shadow: var(--theme-trade-select-shadow);
    border-radius: 4px;
    top: 100%;
    border-radius: 8px;
    right: 0;
    min-width: 59px;
    position: relative;
    top: 12px;
    overflow: auto;
    .top {
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 13px;
      padding-right: 17px;
      font-size: 12px;
      .active {
        color: var(--skin-main-font-color);
      }

      > :global(div) {
        cursor: pointer;
        color: var(--theme-font-color-1);
        padding: 10px 0;
        display: flex;
        align-items: center;

        .icon {
          margin-right: 7px;
          width: 16px;
          height: 16px;
        }
        &:last-child {
          margin-bottom: 0px;
        }
      }
    }
    .bottom {
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 13px;
      padding-right: 17px;
      font-size: 12px;
      border-top: 1px solid var(--theme-deep-border-color-1);
      > :global(div) {
        cursor: pointer;
        color: var(--theme-font-color-1);
        padding: 10px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .icon {
          margin-right: 7px;
          margin-top: 1px;
          width: 16px;
          height: 16px;
        }
        &:last-child {
          margin-bottom: 0px;
        }
      }
    }
  }
`;
const clsx = clsxWithScope(className);
