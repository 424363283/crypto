import CommonIcon from '@/components/common-icon';
import { DesktopOrTablet } from '@/components/responsive';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { WS } from '@/core/network';
import { TIME_ZON } from '@/core/shared';
import { RootColor } from '@/core/styles/src/theme/global/root';
import { clsx } from '@/core/utils';
import { MediaInfo } from '@/core/utils/src/media-info';
import type { RadioChangeEvent } from 'antd';
import { Radio } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { ThemeModeSwitch } from '../switch';
import { QuoteChange } from './quote-change';
import LayoutTab from './tab';
 
interface ConfigMenuProps {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}
export const ConfigMenu = (props: ConfigMenuProps) => {
  const { onMouseEnter, onMouseLeave } = props;
  const { isDark, toggleTheme } = useTheme();
  const [showQuoteChange, setShowQuoteChange] = useState(false);
  const [timeZoneText, setTimeZoneText] = useState(LANG('24小时制'));
  const [value, setValue] = useState(1);

  const onSwitchChange = () => {
    toggleTheme();
  };
  const onRadioChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
    RootColor.setColorRGB(e.target.value);
  };
  const onQuoteChangeItemClick = () => {
    setShowQuoteChange(true);
  };
  const onTimeZoneSelected = (title: string) => {
    setTimeZoneText(title);
  };
  useEffect(() => {
    const timeZoneItem = TIME_ZON.find((item) => item.value === String(WS.timeOffset)) || { title: LANG('24小时制') };
    setTimeZoneText(timeZoneItem?.title);
  }, [WS.timeOffset]);

  useEffect(() => {
    const has24H = TIME_ZON.find((item) => item.value === '24');
    if (!has24H) {
      TIME_ZON.unshift({
        title: LANG('24小时制'),
        value: '24',
      });
    }
    const index = RootColor.getColorIndex;
    setValue(index);
    RootColor.setColorRGB(index, false);
  }, []);
  const renderMainConfigContent = () => {
    return (
      <div className='main-config-content' onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <div className={clsx('list-item', 'header')}>
          <p className='title'>{LANG('主题模式')}</p>
          <ThemeModeSwitch onChange={onSwitchChange} checked={isDark} />
        </div>
        <div className={clsx('list-item', 'quote-change')} onClick={onQuoteChangeItemClick}>
          <p className='title'>{LANG('涨跌幅基准')}</p>
          <div className='right-txt'>
            <span className='selected-time'>{timeZoneText}</span>
            <Image src='/static/images/common/page_next.png' width={12} height={12} alt='icon' />
          </div>
        </div>
        <div className={clsx('list-item', 'color-config-item')}>
          <p className='config-title'>{LANG('颜色配置')}</p>
          <Radio.Group onChange={onRadioChange} value={value}>
            <ul className='config-wrapper'>
              <li className='color-item'>
                <Radio aria-label={LANG('绿涨红跌')} value={1}>
                  {LANG('绿涨红跌')}
                </Radio>
                <CommonIcon name='common-green-up-red-down-0' size={16} />
              </li>
              <li className='color-item'>
                <Radio aria-label={LANG('红涨绿跌')} value={2}>
                  {LANG('红涨绿跌')}
                </Radio>
                <CommonIcon name='common-red-up-green-down-0' size={16} />
              </li>
              <li className='color-item'>
                <Radio aria-label={LANG('红涨蓝跌')} value={3}>
                  {LANG('红涨蓝跌')}
                </Radio>
                <CommonIcon name='common-red-up-blue-down-0' size={16} />
              </li>
              <li className='color-item'>
                <Radio aria-label={LANG('色觉障碍')} value={4}>
                  {LANG('色觉障碍')} (CVD)
                </Radio>
                <Image src='/static/images/header/media/cvd-icon.svg' width={16} height={16} alt='icon' />
              </li>
            </ul>
          </Radio.Group>
        </div>
        <DesktopOrTablet>
          <div className='layout-wrapper'>
            <p className='title'>{LANG('布局')}</p>
            <LayoutTab />
          </div>
        </DesktopOrTablet>
        <style jsx>{styles}</style>
      </div>
    );
  };
  return showQuoteChange ? (
    <QuoteChange goBack={() => setShowQuoteChange(false)} onTimeZoneSelected={onTimeZoneSelected} />
  ) : (
    renderMainConfigContent()
  );
};
const styles = css`
  .main-config-content {
    padding: 0 16px 12px;
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
      .right-txt {
        .selected-time {
          color: var(--theme-font-color-3);
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
