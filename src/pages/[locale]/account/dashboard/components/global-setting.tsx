import CommonIcon from '@/components/common-icon';
import { Select } from '@/components/select';
import { LANG } from '@/core/i18n';
import { WS } from '@/core/network';
import { TIME_ZON } from '@/core/shared';
import { RootColor } from '@/core/styles/src/theme/global/root';
import { MediaInfo } from '@/core/utils';
import type { RadioChangeEvent } from 'antd';
import { Radio } from 'antd';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';

export default function GlobalSetting() {
  const [value, setValue] = useState(1);
  const [quoteOption, setQuoteOption] = useState('24h');
  const [selectedTime, setSelectedTime] = useState<{ label: string; value: string }[]>([
    { label: 'UTC-8', value: '16' },
  ]);
  const [timeZone, setTimeZone] = useState([{ label: '', value: '' }]);
  const onRadioChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
    RootColor.setColorRGB(e.target.value);
  };
  const onUtcTimeSelect = (val: { label: string; value: string }[]) => {
    setSelectedTime(val);
    setQuoteOption('utc-time');
    WS.setTimeOffset(val[0].value);
  };
  useEffect(() => {
    const index = RootColor.getColorIndex;
    setValue(index);
    const formatTimeZone = TIME_ZON.map((item) => {
      return {
        value: item.value,
        label: item.title,
      };
    });
    setTimeZone(formatTimeZone);

    if (WS.timeOffset == '24') {
      setQuoteOption('24h');
    } else {
      setQuoteOption('utc-time');
      setSelectedTime([
        { label: TIME_ZON.find((item) => item.value === String(WS.timeOffset))?.title || '', value: WS.timeOffset },
      ]);
    }
  }, []);

  const onQuoteOptionChange = (e: RadioChangeEvent) => {
    const option = e.target.value;
    if (option === 'utc-time') {
      WS.setTimeOffset(selectedTime[0].value);
    } else {
      WS.setTimeOffset('24');
    }
    setQuoteOption(option);
  };
  return (
    <div className='global-setting-wrapper'>
      <h1 className='title'>{LANG('设置')}</h1>
      <div className='trade-setting'>
        <p className='trade-title'>{LANG('交易')}</p>
        <div className='color-setting'>
          <p className='config-title'>{LANG('颜色配置')}</p>
          <Radio.Group onChange={onRadioChange} value={value}>
            <ul className='config-wrapper'>
              <li className='color-item'>
                <Radio value={1}>{LANG('绿涨红跌')}</Radio>
                <CommonIcon name='common-green-up-red-down-0' size={16} />
              </li>
              <li className='color-item'>
                <Radio value={2}>{LANG('红涨绿跌')}</Radio>
                <CommonIcon name='common-red-up-green-down-0' size={16} />
              </li>
              <li className='color-item'>
                <Radio value={3}>{LANG('红涨蓝跌')}</Radio>
                <CommonIcon name='common-red-up-green-down-0' size={16} />
              </li>
              <li className='color-item'>
                <Radio value={4}>{LANG('色觉障碍')} (CVD)</Radio>
                <Image src='/static/images/header/media/cvd-icon.svg' width={16} height={16} alt='icon' />
              </li>
            </ul>
          </Radio.Group>
        </div>
      </div>
      <div className='change-setting'>
        <p className='base-title'>{LANG('涨跌幅基准')}</p>
        <div className='option-right'>
          <Radio.Group onChange={onQuoteOptionChange} value={quoteOption}>
            <Radio value='24h'>
              <span className='label'>{LANG('24小时制')}</span>
            </Radio>
            <Radio value='utc-time'>
              <span className='label'>{LANG('UTC时间')}</span>
            </Radio>
          </Radio.Group>
          <Select values={selectedTime} options={timeZone} onChange={onUtcTimeSelect} />
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
const styles = css`
  .global-setting-wrapper {
    width: 100%;
    height: calc(100vh - 82px);
    background-color: var(--theme-background-color-2);
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    @media ${MediaInfo.tablet} {
      height: calc(100vh - 300px);
    }
    @media ${MediaInfo.mobile} {
      height: calc(100vh - 280px);
    }
    @media ${MediaInfo.mobileOrTablet} {
      border-radius: 15px;
    }
    .title {
      color: var(--theme-font-color-1);
      font-size: 20px;
      font-weight: 500;
      border-bottom: 1px solid var(--theme-border-color-2);
      padding-bottom: 25px;
      padding-top: 28px;
      padding-left: 20px;
    }
    .trade-setting {
      margin: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--theme-border-color-2);
      .trade-title {
        color: var(--theme-font-color-1);
        font-size: 16px;
        font-weight: 500;
      }
      .color-setting {
        @media ${MediaInfo.desktop} {
          display: flex;
          justify-content: space-between;
        }
        margin-top: 30px;
        .config-title {
          color: var(--theme-font-color-1);
          font-size: 14px;
        }
        .config-wrapper {
          display: flex;
          align-items: center;
          padding-left: 0;
          @media ${MediaInfo.mobileOrTablet} {
            margin-top: 15px;
          }
          @media ${MediaInfo.mobile} {
            flex-direction: column;
            align-items: flex-start;
          }
          .color-item {
            @media ${MediaInfo.mobile} {
              margin-bottom: 12px;
            }
            :global(span) {
              color: var(--theme-font-color-1);
            }
            &:not(:last-child) {
              margin-right: 60px;
            }
          }
        }
      }
    }
    .change-setting {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--theme-border-color-2);
      margin: 20px;
      padding-bottom: 26px;
      @media ${MediaInfo.mobile} {
        flex-direction: column;
        align-items: flex-start;
      }
      .base-title {
        color: var(--theme-font-color-1);
        font-size: 14px;
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
