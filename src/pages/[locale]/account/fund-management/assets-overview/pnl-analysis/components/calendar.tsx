import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { HidePrice } from './hide-price';

interface CalendarProps {
  selectedDate: string;
  profitDayData: ProfitData[];
  eyeOpen: boolean;
}
interface ProfitData {
  date: string;
  profit: string;
  rate: string;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, profitDayData, eyeOpen }) => {
  const [days, setDays] = useState<number[]>([]);
  useEffect(() => {
    const firstDayOfWeek = dayjs(selectedDate).startOf('month').day();
    const daysInMonth = dayjs(selectedDate).daysInMonth();
    setDays(
      Array(firstDayOfWeek)
        .fill(null)
        .concat([...Array(daysInMonth).keys()].map((i) => i + 1))
    );
  }, [selectedDate]);

  // 将profitDay数组转换为对象，以便通过日期查找数据
  const profitMap: { [key: string]: Pick<ProfitData, 'profit' | 'rate'> } = {};
  profitDayData.forEach((item) => {
    profitMap[Number(item.date)] = { profit: item.profit, rate: item.rate };
  });

  // 合并数据到days数组，保留null
  const mergedData: ProfitData[] = days.map((date) => {
    if (date !== null && profitMap[date]) {
      return { date, ...profitMap[date] };
    } else if (date !== null) {
      return { date, profit: '0.00', rate: '0.00' } as any;
    } else {
      return null;
    }
  });

  const currentMonth = dayjs().format('MM');
  const currentDay = dayjs().format('DD');
  const selectedMonth = dayjs(selectedDate).format('MM'); // 下拉选中的月份
  const currentWeekDay = dayjs().day(); // 当前礼拜几
  const WEEK_DAYS = [
    {
      key: 7,
      day: LANG('日'),
    },
    {
      key: 1,
      day: LANG('一'),
    },
    {
      key: 2,
      day: LANG('二'),
    },
    {
      key: 3,
      day: LANG('三'),
    },
    {
      key: 4,
      day: LANG('四'),
    },
    {
      key: 5,
      day: LANG('五'),
    },
    {
      key: 6,
      day: LANG('六'),
    },
  ];
  return (
    <div className='calendar-container'>
      <div className='calendar'>
        <div className='weekdays'>
          {WEEK_DAYS.map((item) => (
            <div key={item.key} className={clsx(currentWeekDay === item.key && 'hight-light-weekday')}>
              {item.day}
            </div>
          ))}
        </div>
        <div className='days'>
          {mergedData.map((day, index) => {
            const breakEven = Number(day?.profit) === 0 && eyeOpen ? 'break-even' : '';
            const loss = Number(day?.profit) < 0 && eyeOpen ? 'loss' : '';
            const profit = Number(day?.profit) > 0 && eyeOpen ? 'profit' : '';
            const isHighlightDay = selectedMonth === currentMonth && currentDay == day?.date;
            return (
              <div
                className={clsx(
                  'day-card',
                  day === null && 'empty',
                  breakEven,
                  loss,
                  profit,
                  isHighlightDay && 'high-light-day'
                )}
                key={index}
              >
                {day && (
                  <>
                    <span className='date'>{day?.date}</span>
                    <span className='profit'>
                      <HidePrice eyeOpen={eyeOpen} length={4}>
                        {day?.profit}
                      </HidePrice>
                    </span>
                    <span className='rate'>
                      <HidePrice eyeOpen={eyeOpen} length={4}>
                        {day?.rate}%
                      </HidePrice>
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

export default Calendar;

const styles = css`
  .calendar-container {
    width: 100%;
    margin-top: 15px;
  }

  .calendar {
    display: flex;
    flex-direction: column;
  }

  .weekdays {
    display: flex;
    justify-content: space-between;
    background-color: var(--theme-background-color-3);
    color: white;
    padding: 6px;
    border-radius: 5px;
    margin-bottom: 14px;
    .hight-light-weekday {
      color: var(--skin-color-active);
    }
  }

  .weekdays > div {
    flex: 1;
    text-align: center;
    color: var(--theme-font-color-1);
    font-size: 12px;
    font-weight: 500;
  }
  .days {
    display: flex;
    flex-wrap: wrap;
  }
  .day-card {
    background-color: rgba(158, 158, 157, 0.1);
    flex: 0 0 calc(14.28% - 6px); /* 14.28% to evenly distribute 7 days, subtract 6px for spacing */
    height: 63px;
    text-align: center;
    border-radius: 6px;
    margin: 3px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    .date {
      font-size: 16px;
      font-weight: 500;
      color: var(--theme-font-color-1);
    }
    .profit,
    .rate {
      color: var(--theme-font-color-3);
      font-size: 12px;
      font-weight: 500;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .day-card.break-even {
    background-color: rgba(158, 158, 157, 0.1);
  }
  .day-card.loss {
    background-color: rgba(240, 78, 63, 0.1);
    .profit,
    .rate {
      color: var(--color-red);
    }
  }
  .day-card.profit {
    background-color: rgba(67, 188, 156, 0.1);
    .profit,
    .rate {
      color: var(--color-green);
    }
  }
  .day-card.empty {
    background-color: transparent;
    border: none;
  }
  .day-card.high-light-day {
    background-color: rgba(158, 158, 157, 1);
    span {
      color: #fff;
    }
  }
`;
