import CommonIcon from '@/components/common-icon';
import { getAccountProfitCalendarApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { message } from '@/core/utils';
import { Dropdown, MenuProps } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import Calendar from './calendar';
import { HidePrice } from './hide-price';
interface ProfitData {
  date: string;
  rate: string;
  profit: string;
}
export const SpotPnlCalendar = ({ eyeOpen }: { eyeOpen: boolean }) => {
  const currentYear = dayjs().year();
  // 当前月份
  const currentMonth = dayjs().month() + 1;
  // 当前月份往前推3个月的月份数组
  const previousMonths = [];
  for (let i = 0; i < 3; i++) {
    const date = dayjs().subtract(i + 1, 'month');
    previousMonths.push(date.month() + 1);
  }
  const [state, setState] = useImmer({
    profitDayData: [] as ProfitData[],
    selectedDayRange: 7,
    selectedTime: { label: `${currentYear}/${currentMonth} ${LANG('月')}`, key: currentMonth },
  });
  const { selectedTime, profitDayData } = state;
  const givenMonth = selectedTime.key;
  const firstDayOfMonth = dayjs()
    .year(currentYear)
    .month(givenMonth - 1)
    .date(1)
    .hour(0)
    .minute(0)
    .second(0);
  const formattedDate = firstDayOfMonth.format('YYYY-MM-DD H:m:s');
  const currentMonthOption = [{ label: `${currentYear}/${currentMonth} ${LANG('月')}`, key: currentMonth }];
  const previousMonthOption = previousMonths.map((item) => {
    return { label: `${currentYear}/${item} ${LANG('月')}`, key: item };
  });
  const totalMonthOption = currentMonthOption.concat(previousMonthOption);
  const handleButtonClick: MenuProps['onClick'] = (item) => {
    const value = totalMonthOption.find((i: any) => i?.key == item.key) || selectedTime;
    setState((draft) => {
      draft.selectedTime = value;
    });
  };
  // 初始值为0，用于累加
  const initialTotalProfit = '0.00';
  const initialTotalRate = '0.00';

  // 使用reduce函数计算累加值
  const result = profitDayData.reduce(
    function (accumulator, currentValue) {
      // 累加profit和rate到accumulator
      accumulator.totalProfit = Number(currentValue.profit).add(Number(accumulator.totalProfit));
      accumulator.totalRate = Number(currentValue.rate).add(accumulator.totalRate);

      return accumulator;
    },
    { totalProfit: initialTotalProfit, totalRate: initialTotalRate }
  );
  const { totalProfit, totalRate } = result;
  const getAccountDayProfit = async () => {
    const res = await getAccountProfitCalendarApi({
      type: 2,
      startTime: dayjs(formattedDate).valueOf(),
    });
    if (res.code === 200) {
      setState((draft) => {
        draft.profitDayData =
          res.data.map((item) => {
            return {
              profit: item.profit?.toFixed(2),
              rate: item.rate?.mul(100).toFixed(2),
              date: dayjs(item.date).format('DD'),
            };
          }) || [];
      });
    } else {
      message.error(res.message);
    }
  };
  useEffect(() => {
    getAccountDayProfit();
  }, [selectedTime, formattedDate]);
  return (
    <div className='spot-pnl-calendar'>
      <div className='filter-title-area'>
        <div className='title'>{LANG('盈亏日历')}</div>
        <Dropdown menu={{ items: totalMonthOption, onClick: handleButtonClick }} trigger={['click']}>
          <div className='dropdown-btn'>
            {selectedTime.label}
            <CommonIcon size={12} name='common-tiny-triangle-down' />
          </div>
        </Dropdown>
      </div>
      <div className='sub-title'>
        <span className='profit'>
          {selectedTime.key + LANG('月收益')}
          <span className={Number(totalProfit) < 0 ? 'negative' : 'positive'}>
            <HidePrice length={4} eyeOpen={eyeOpen}>
              {totalProfit?.toFormat(4)}
            </HidePrice>
          </span>
        </span>
        <span className='profit'>
          {LANG('收益率')}
          <span className={Number(totalRate) < 0 ? 'negative' : 'positive'}>
            <HidePrice eyeOpen={eyeOpen} length={4}>
              {totalRate?.toFixed(2)}%
            </HidePrice>
          </span>
        </span>
      </div>
      <Calendar selectedDate={formattedDate} profitDayData={profitDayData} eyeOpen={eyeOpen} />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .spot-pnl-calendar {
    .filter-title-area {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 30px;
      .title {
        font-size: 16px;
        font-weight: 500;
        color: var(--theme-font-color-1);
      }
      .dropdown-btn {
        cursor: pointer;
        color: var(--theme-font-color-3);
        font-size: 12px;
      }
    }
    .sub-title {
      display: flex;
      align-items: center;
      margin-top: 16px;
      .profit {
        margin-right: 6px;
        font-size: 14px;
        color: var(--theme-font-color-1);
        .negative {
          color: var(--color-red);
          margin-left: 4px;
        }
        .positive {
          color: var(--color-green);
          margin-left: 4px;
        }
      }
    }
  }
`;
