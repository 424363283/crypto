import CommonIcon from '@/components/common-icon';
import { LANG } from '@/core/i18n';
import { useAppContext } from '@/core/store';
import { MediaInfo, clsxWithScope } from '@/core/utils';
import { Dropdown } from 'antd';
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import css from 'styled-jsx/css';
import { getKLinePriceType } from '../store';

const GotoDateModal = dynamic(() => import('./components/goto-date-modal'), { ssr: false, loading: () => <div /> });
// const GotoKLineModal = dynamic(() => import('./components/goto-kline-modal'), { ssr: false, loading: () => <div /> });

export const KlineHeaderActionSetting = ({ store, isSwap, qty }: { store: any; isSwap: boolean; qty: number }) => {
  const [visible, setVisible] = useState(false);
  const [gotoDateVisible, setGotoDateVisible] = useState(false);
  const [gotoKLineVisible, setGotoKLineVisible] = useState(false);
  const { isLogin } = useAppContext();
  const active = visible ? true : false;
  const klinePriceType = getKLinePriceType(qty);
  const _handleVisible = useCallback(() => setVisible((v) => !v), []);
  const { setting } = store;
  const options = [];
  if (isSwap && isLogin && klinePriceType == 0) {
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
              <div className={clsx('icon')}>
                {setting[key] && <CommonIcon name='common-checked-0' size={16} enableSkin />}
              </div>
              {label}
            </div>
          );
        })}
      </div>
      <div className={clsx('bottom')}>
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
      </div>
      {/* <div className={clsx('bottom')} style={{ borderTop: 'none' }}>
        <div
          onClick={() => {
            setGotoKLineVisible(true);
            setVisible(false);
            console.log('setGotoKLineVisible');
          }}
        >
          <div className={clsx('icon')}>
            <CommonIcon name='common-filter-gray-0' size={16} />
          </div>
          <div>{LANG('图表设置')}</div>
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
            {active ? (
              <CommonIcon name='common-setting-active-0' enableSkin size={12} />
            ) : (
              <CommonIcon name='common-setting-0' size={12} />
            )}
          </div>
        </Dropdown>
      </div>
      {styles}
      {gotoDateVisible && (
        <GotoDateModal qty={qty} visible={gotoDateVisible} onClose={() => setGotoDateVisible(false)} />
      )}
      {/* {gotoKLineVisible && <GotoKLineModal visible={gotoKLineVisible} onClose={() => setGotoKLineVisible(false)} />} */}
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
  .ant-dropdown .menus {
    background: var(--spec-background-color-2);
    box-shadow: var(--theme-trade-select-shadow);
    border-radius: 4px;
    top: 100%;
    border-radius: 8px;
    right: 0;
    min-width: 59px;
    position: relative;
    top: 12px;
    overflow: auto;
    height: auto;
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
      height: 37px;
      padding-left: 13px;
      padding-right: 17px;
      font-size: 12px;
      border-top: 1px solid var(--theme-deep-border-color-1-1);
      > :global(div) {
        cursor: pointer;
        color: var(--theme-font-color-1);
        padding: 10px 0;
        display: flex;
        align-items: center;
        justify-content: left;
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
