import Radio from '@/components/Radio';
import ProTooltip from '@/components/tooltip';
import { LANG } from '@/core/i18n';
import { WS } from '@/core/network';
import { TIME_ZON } from '@/core/shared';
import { MediaInfo, clsx } from '@/core/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';

// 涨跌幅基准
export const QuoteChange = ({
  onTimeZoneSelected,
}: {
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
      <ul className='time-list'>
        {TIME_ZON.map((item, index) => {
          const isCurrentTimeZone = item.title === timezone;
          const currentTimeZone = isCurrentTimeZone ? `(${LANG('当前时区')})` : '';
          const active = String(selectedTimeZone) === item.value;
          return (
            <li className={ clsx('li-item', active && 'active') } key={index} onClick={() => onTimeZoneClick(item)} >
              <p className='value'>
                {item.title}
                {item.value === '24' ? '' : ', 00:00'} {currentTimeZone}
              </p>
              <Radio label='' checked={active}/>
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
    height: 432px;
    .time-list {
      overflow: scroll;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      padding: 0;
      .li-item {
        width: 100%;
        cursor: pointer;
        display: flex;
        flex: 1 0 0;
        padding: 16px;
        align-items: center;
        gap: 8px;
        border-radius: 12px;
        border: 1px solid transparent;
        .value {
          flex: 1 0 0;
          color: var(--text-secondary);
          font-family: "HarmonyOS Sans SC";
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
        &.active {
          .value {
            color: var(--text-primary);
          }
          border: 1px solid var(--brand);
        }
      }
    }
  }
`;
