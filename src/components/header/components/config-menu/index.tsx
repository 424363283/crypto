import CommonIcon from '@/components/common-icon';
import { DesktopOrTablet } from '@/components/responsive';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { WS } from '@/core/network';
import { TIME_ZON } from '@/core/shared';
import { RootColor } from '@/core/styles/src/theme/global/root';
import { clsx, isSwapTradePage } from '@/core/utils';
import { MediaInfo } from '@/core/utils/src/media-info';
import type { RadioChangeEvent } from 'antd';
// import { Radio } from 'antd';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import css from 'styled-jsx/css';
import { ThemeModeSwitch } from '../switch';
import { QuoteChange } from './quote-change';
import LayoutTab from './tab';
import { QuoteChangeModal } from '@/components/trade-ui/trade-view/swap/components/modal/quote-change-modal';
import { resso } from '@/core/resso';
import { Svg } from '@/components/svg';
import { useLayoutStore } from '@/store/layout';
import Radio from '@/components/Radio';
// import { VaultAccountStore } from '@/store/layout';

interface ConfigMenuProps {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}
export const ConfigMenu = (props: ConfigMenuProps) => {
  const store = useMemo(
    () =>
      resso({
        positionVisible: false
      }),
    []
  );
  const { positionVisible } = store;
  const { onMouseEnter, onMouseLeave } = props;
  const { isDark, toggleTheme } = useTheme();
  const [showQuoteChange, setShowQuoteChange] = useState(false);
  const [timeZoneText, setTimeZoneText] = useState(LANG('24小时制'));
  const [value, setValue] = useState(1);
  //获取全局状态数据
  const resetLayout = useLayoutStore(state => state.resetLayout);
  const toggleResetLayout = useLayoutStore(state => state.toggleResetLayout);
  const _isSwapTradePage = isSwapTradePage();

  // const { setVaultVisbleState } = VaultAccountStore();

  const onSwitchChange = () => {
    toggleTheme();
  };
  // const onRadioChange = (e: RadioChangeEvent) => {
  //   setValue(e.target.value);
  //   RootColor.setColorRGB(e.target.value);
  // };
  const onRadioChange = e => {
    setValue(e);
    RootColor.setColorRGB(e);
  };
  const onQuoteChangeItemClick = () => {
    // setShowQuoteChange(true);
    store.positionVisible = !store.positionVisible;
  };
  const onTimeZoneSelected = (title: string) => {
    setTimeZoneText(title);
  };
  const _handlePositionVisible = () => {
    store.positionVisible = !store.positionVisible;
  };
  useEffect(() => {
    const timeZoneItem = TIME_ZON.find(item => item.value === String(WS.timeOffset)) || { title: LANG('24小时制') };
    setTimeZoneText(timeZoneItem?.title);
  }, [WS.timeOffset]);

  useEffect(() => {
    const has24H = TIME_ZON.find(item => item.value === '24');
    if (!has24H) {
      TIME_ZON.unshift({
        title: LANG('24小时制'),
        value: '24'
      });
    }
    const index = RootColor.getColorIndex;
    setValue(index);
    RootColor.setColorRGB(index, false);
  }, []);

  const resetLayoutFun = () => {
    toggleResetLayout();
  };

  const renderMainConfigContent = () => {
    return (
      <div className="main-config-content" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {/* <div className={clsx('list-item', 'header')}>
          <p className='title'>{LANG('主题模式')}</p>
          <ThemeModeSwitch onChange={onSwitchChange} checked={isDark} />
        </div> */}
        {/* <div className={clsx('list-item', 'quote-change')} onClick={onQuoteChangeItemClick}>
          <p className='title'>{LANG('涨跌幅基准')}</p>
          <div className='right-txt'>
            <span className='selected-time'>{timeZoneText}</span>
            <CommonIcon name='common-arrow-more-0' width={24} height={24} enableSkin />
          </div>
        </div> */}

        <div className={clsx('list-item', 'color-config-item')}>
          <p className="config-title">{LANG('颜色配置')}</p>
          <div className="configColorContent">
            <div className="configColorList">
              <Radio
                large={true}
                label={
                  <div className="configColorLable">
                    <span className="configColorLableName">{LANG('绿涨红跌')}</span>
                    <span>
                      <CommonIcon name="common-green-up-red-down-0" size={16} />
                    </span>
                  </div>
                }
                checked={value == 1}
                onChange={checked => onRadioChange(1)}
              />
            </div>

            <div className="configColorList">
              <Radio
                large={true}
                label={
                  <div className="configColorLable">
                    <span className="configColorLableName">{LANG('红涨绿跌')}</span>
                    <span>
                      <CommonIcon name="common-red-up-green-down-0" size={16} />
                    </span>
                  </div>
                }
                checked={value == 2}
                onChange={checked => onRadioChange(2)}
              />
            </div>

            <div className="configColorList">
              <Radio
                large={true}
                label={
                  <div className="configColorLable">
                    <span className="configColorLableName">{LANG('红涨蓝跌')}</span>
                    <span>
                      <CommonIcon name="common-red-up-blue-down-0" size={16} />
                    </span>
                  </div>
                }
                checked={value == 3}
                onChange={checked => onRadioChange(3)}
              />
            </div>

            <div className="configColorList">
              <Radio
                large={true}
                label={
                  <div className="configColorLable">
                    <span className="configColorLableName">{LANG('色觉障碍')} (CVD)</span>
                    <span>
                      <Image src="/static/images/header/media/cvd-icon.svg" width={16} height={16} alt="icon" />
                    </span>
                  </div>
                }
                checked={value == 4}
                onChange={checked => onRadioChange(4)}
              />
            </div>
          </div>
        </div>
        {_isSwapTradePage && (
          <div className={clsx('list-item', 'header')}>
            <p className="config-title">{LANG('其他设置')}</p>
            <div className="config-wrapper">
              <div className="restore-item" onClick={() => resetLayoutFun()}>
                <Svg src={`/static/icons/primary/kline/restore.svg`} width={14} />

                <span className="restoreIcon">{LANG('重置为默认布局')}</span>
              </div>
            </div>
          </div>
        )}

        {/* <DesktopOrTablet>
          <div className='layout-wrapper'>
            <p className='title'>{LANG('布局')}</p>
            <LayoutTab />
          </div>
        </DesktopOrTablet> */}
        <style jsx>{styles}</style>
        <QuoteChangeModal
          visible={positionVisible}
          onTimeZoneSelected={onTimeZoneSelected}
          onClose={_handlePositionVisible}
          zIndex={100000}
        />
      </div>
    );
  };
  return renderMainConfigContent();
};
const styles = css`
  .configColorContent {
    margin-top: 41px;
    @media ${MediaInfo.mobile} {
      width: 100%;
    }

    .configColorLable {
      display: flex;
      width: 310px;
      align-items: center;
      justify-content: space-between;
      @media ${MediaInfo.mobile} {
        width: 100%;
        flex: 1;
      }
    }
    .configColorList {
      margin-bottom: 24px;
      @media ${MediaInfo.mobile} {
        margin-bottom: 1.5rem;
        width: 100%;
        :global(.icon-radio, .icon-radio > span) {
          width: 100%;
        }
      }
    }
    .configColorLableName {
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      color: var(--text-secondary);
    }
  }
  .restore-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    .restoreIcon {
      margin-left: 4px;
    }
  }
  .main-config-content {
    padding: 0 24px 12px;
    .list-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 16px;
      cursor: default;
      border-bottom: 1px solid var(--skin-border-color-1);
      color: var(--theme-font-color-1);
      font-size: 14px;
      font-weight: 400;
      padding: 20px 0;
      @media ${MediaInfo.mobile} {
        &:last-child {
          border-bottom: 0;
        }
      }
      .config-title {
        position: absolute;
        top: 20px;
        color: var(--theme-font-color-3);
        font-size: 14px;
        font-weight: 400;
      }
      :global(.ant-radio-group) {
        width: 100%;
      }
      .config-wrapper {
        margin-top: 36px;
        margin-left: 0;
        padding: 0;
        width: 100%;
        .color-item {
          display: flex;
          justify-content: space-between;
          :global(span) {
            color: var(--theme-font-color-1);
          }
          &:not(:last-child) {
            margin-bottom: 20px;
          }
        }
      }
    }
    .color-config-item {
      @media ${MediaInfo.mobile} {
        border-bottom: none;
      }
    }
    .quote-change {
      cursor: pointer;
      @media ${MediaInfo.mobile} {
        margin-bottom: 1.5rem;
      }
      .title {
        color: var(--text-secondary);
      }
      .right-txt {
        display: flex;
        align-items: center;
        .selected-time {
          color: var(--text-primary);
          margin-right: 10px;
          font-size: 14px;
          font-weight: 400;
        }
      }
    }
    .layout-wrapper {
      .title {
        color: var(--theme-font-color-3);
        margin-top: 20px;
      }
    }
  }
`;
