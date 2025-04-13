import { ThemeModeSwitch } from '@/components/header/components/switch';
import { useResponsive, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { WS } from '@/core/network';
import { TIME_ZON } from '@/core/shared';
import { RootColor } from '@/core/styles/src/theme/global/root';
import { MediaInfo } from '@/core/utils';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import FavorColorSetting from './favor-color';
import TimeZone from './time-zone';
import { Button } from '@/components/button';
import { Size } from '@/components/constants';
import { Desktop } from '@/components/responsive';

export default function GlobalSetting() {
  const { isMobile } = useResponsive();
  const [selectedTime, setSelectedTime] = useState<{ label: string; value: string }[]>([
    { label: 'UTC-8', value: '16' },
  ]);
  // const [timeZone, setTimeZone] = useState([{ label: '', value: '' }]);
  const [value, setValue] = useState(1);
  // const colorText = ['', LANG('绿涨红跌'), LANG('红涨绿跌'), LANG('红涨蓝跌'),LANG('色觉障碍')];
  // const colorImg = ['', 'common-green-up-red-down-0', 'common-red-up-green-down-0','common-red-up-blue-down','common-cvd'];
  useEffect(() => {
    if (WS.timeOffset == '24') {
      setSelectedTime([
        { label: LANG('近24小时'), value: '24'},
    ]);
    } else {
      setSelectedTime([
        { label: TIME_ZON.find((item) => item.value === String(WS.timeOffset))?.title || '', value: WS.timeOffset },
      ]);
    }
  }, [WS.timeOffset]);


  useEffect(() => { 
    const index = RootColor.getColorIndex;
    setValue(index);
  },[RootColor.getColorIndex])


  const { isDark, toggleTheme } = useTheme();
  const onSwitchChange = () => {
    toggleTheme();
  };

  const [favorColorsShow, setFavorColorsShow] = useState<boolean>(false);
  const [timeZoneShow, setTimeZoneShow] = useState<boolean>(false);

  return (
    <div className='global-setting-wrapper'>
      <Desktop>
        <h1 className='title'>{LANG('设置')}</h1>
      </Desktop>
      <div className='setting-box'>
        {/* <div className='change-setting'>
          <p className='base-title'>{LANG('颜色偏好设置')}</p>
          <div className='setting-bar'>
            <div className='setting-subtitle'><CommonIcon name={colorImg[value]} size={16} /> {colorText[value]}</div>
            <div className='setting-edit' onClick={()=>setFavorColorsShow(true)}>{LANG('编辑')}</div>
          </div>
        </div> */}
        <div className='change-setting'>
        <p className='base-title'>{LANG('UTC时区')}</p>
        <div className='setting-bar'>
          <div className='setting-subtitle'>{selectedTime[0].label }</div>
          <Button size={Size.SM} width={isMobile? 40: 72} rounded onClick={()=> setTimeZoneShow(true)}>{LANG('编辑')}</Button>
        </div>
        {/* <div className='option-right'>
          <Radio.Group onChange={onQuoteOptionChange} value={quoteOption}>
            <Radio value='24h'>
              <span className='label'>{LANG('24小时制')}</span>
            </Radio>
            <Radio value='utc-time'>
              <span className='label'>{LANG('UTC时间')}</span>
            </Radio>
          </Radio.Group>
          <Select disabled={quoteOption == '24h'} values={selectedTime} options={timeZone} onChange={onUtcTimeSelect} />
        </div> */}
        </div>
        <div className='change-setting'>
          <p className='base-title'>{LANG('主题背景')}</p>
          <div className='setting-bar'>
            <div className='setting-subtitle'>{LANG(isDark?'黑夜模式':'白天模式') }</div>
            <div className="setting-theme-box"><ThemeModeSwitch onChange={onSwitchChange} checked={isDark} /></div>
          </div>
        </div>
      </div>
      <FavorColorSetting
        isOpen={favorColorsShow}
        close={() => setFavorColorsShow(false)}
      />
      <TimeZone
        isOpen={timeZoneShow}
        close={() => setTimeZoneShow(false)}
      />
      <style jsx>{styles}</style>
    </div>
  );
}
const styles = css`
  .global-setting-wrapper {
    min-height: calc(100vh - 81px);
    border: 1px solid var(--line-1);
    border-radius: 8px;
    background-color: var(--bg-1);
    @media ${MediaInfo.tablet} {
      height: calc(100vh - 300px);
    }
    @media ${MediaInfo.mobile} {
      height: calc(100vh - 280px);
      margin: 0 12px 12px;
    }
    @media ${MediaInfo.mobileOrTablet} {
      border-radius: 15px;
    }
    .title {
      color: var(--text-primary);
      font-size: 24px;
      font-weight: 500;
      padding-bottom: 25px;
      padding-top: 28px;
      padding-left: 20px;
    }
    
    .change-setting {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 20px;
      padding-bottom: 26px;
      &:last-child {
        padding-bottom: 0;
      }
      @media ${MediaInfo.mobile} {
        flex-direction: row;
        align-items: center;
        padding-bottom: 10px;
      }
      .base-title{
        color: var(--text-primary);
        font-size: 14px;
        font-weight: 500;
      }
      .setting-bar{
        display: flex;
        justify-content: center;
        .setting-subtitle{
          font-size: 14px;
          margin-right: 15px;
          line-height: 30px;   
          color: var(--text-primary);    
          font-weight: 400;  
        }
        .setting-edit{
          width: 72px;
          height: 32px;
          background:var(--fill-3);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          font-size: 14px;
          color: var(--text-primary);
          cursor: pointer;
        }
        .setting-theme-box{
          :global(.ant-switch-checked .ant-switch-handle) {
            inset-inline-start:calc(100% - 28px);
          }
          :global(.theme-mode-switch){
            width: 70px;
            height: 30px;
            :global(.ant-switch-handle) {
              &:before {
                height: 26px;
                width: 26px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
              }
            }
            :global(.ant-switch-inner) {
              background:var(--fill-3) !important;
            }
          }
        }
      }
      .option-right {
        display: flex;
        align-items: center;
        @media ${MediaInfo.mobile} {
          margin-top: 10px;
        }
        :global(.label) {
          color: var(--theme-font-color-1);
          font-size: 12px;
        }
        :global(.select-wrapper .dropdown-wrapper .react-dropdown-select) {
          background-color: var(--theme-background-color-3);
          border: none;
          border-radius: 8px;
        }
      }
    }
  }
`;
