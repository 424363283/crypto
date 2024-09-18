import ProTooltip from '@/components/tooltip';
import { LANG } from '@/core/i18n';
import { WS } from '@/core/network';
import { TIME_ZON } from '@/core/shared';
import { MediaInfo } from '@/core/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';

// 涨跌幅基准
export const QuoteChange = ({
  goBack,
  onTimeZoneSelected,
}: {
  goBack: () => void;
  onTimeZoneSelected: (title: string) => void;
}) => {
  const offset = new Date().getTimezoneOffset();
  const [selectedTimeZone, setSelectedTimeZone] = useState('24' as string); // TODO: 保存数据到localStorage
  const timezone = 'UTC' + (offset > 0 ? '-' : '+') + Math.abs(offset / 60);
  const onTimeZoneClick = (item: { title: string; value: string }) => {
    WS.setTimeOffset(item.value);
    setSelectedTimeZone(item.value);
    onTimeZoneSelected(item.title);
  };
  useEffect(() => {
    setSelectedTimeZone(WS.timeOffset);
  }, [WS.timeOffset]);
  const TooltipTitle = () => {
    return (
      <div>
        <p>
          {LANG(
            '1. 当您切换到新的 UTC 时区时，现货、杠杆、期权和合约（不包括模拟交易）的涨跌幅 (%) 将根据您所选时区0点的开盘价格为基准来计算。'
          )}
        </p>
        <p>{LANG('2. 切换到新的 UTC 时区只会影响涨跌幅 (%)的变化。此更改不适用于K线。')}</p>
      </div>
    );
  };
  return (
    <div className='base-wrapper'>
      <div className='back' onClick={goBack}>
        <Image src='/static/images/common/back.svg' width={24} height={24} alt='back' />
      </div>
      <h2 className='title'>
        <span>{LANG('涨跌幅基准')}</span>
        <ProTooltip title={<TooltipTitle />}>
          <Image src='/static/images/common/question-mark.svg' width={16} height={16} alt='icon' className='icon' />
        </ProTooltip>
      </h2>
      <ul className='time-list'>
        {TIME_ZON.map((item, index) => {
          const isCurrentTimeZone = item.title === timezone;
          const currentTimeZone = isCurrentTimeZone ? `(${LANG('当前时区')})` : '';
          return (
            <li key={index} onClick={() => onTimeZoneClick(item)} className='li-item'>
              <p className='value'>
                {item.title}
                {item.value === '24' ? '' : ', 00:00'} {currentTimeZone}
              </p>
              {String(selectedTimeZone) === item.value ? (
                <Image src='/static/images/common/check.svg' width={16} height={16} alt='check' />
              ) : null}
            </li>
          );
        })}
      </ul>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .base-wrapper {
    cursor: default;
    padding: 20px 28px 25px;
    @media ${MediaInfo.mobile} {
      padding: 0;
    }
    height: 100%;
    .back {
      cursor: pointer;
    }
    .title {
      display: flex;
      align-items: center;
      margin-top: 20px;
      color: var(--theme-trade-text-color-1);
      font-size: 16px;
      font-weight: 400;
      :global(.icon) {
        margin-left: 10px;
      }
    }
    .time-list {
      margin-top: 28px;
      overflow: scroll;
      padding: 0;
      height: 100%;
      padding-bottom: 30px;
      .li-item {
        cursor: pointer;
        color: var(--theme-trade-text-color-1);
        display: flex;
        align-items: center;
        justify-content: space-between;
        &:not(:last-child) {
          margin-bottom: 28px;
        }
        &:last-child {
          margin-bottom: 55px;
        }
      }
    }
  }
`;
