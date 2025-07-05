// 包含下拉列表的日历范围选择器组件
import { DateRangePicker } from '@/components/date-range-picker';
import { Select } from '@/components/select';
import { LANG } from '@/core/i18n';
import { getFormatDateRange } from '@/core/utils';
import dayjs from 'dayjs';
import { useCallback, useEffect } from 'react';
import { useImmer } from 'use-immer';
import { DesktopOrTablet, Mobile } from '../responsive';
import css from 'styled-jsx/css';
import { Svg } from '@/components/svg';

interface DateRangeSelectorProps {
  /**
   * @param param0 下拉列表或日历选择器变动时触发
   */
  onDateRangeChange: ({ startDate, endDate }: { startDate: string; endDate: string }) => void;
  /**
   * @param values 下拉列表变动时触发，不携带日期参数
   */
  onSelectChange?: (values: { label: string; value: number }[], index: number) => void;
  dayOptionWidth?: number;
}
export const DateRangeSelector = (props: DateRangeSelectorProps) => {
  const { onDateRangeChange, onSelectChange, dayOptionWidth = 200 } = props;
  const { start = '', end = '' } = getFormatDateRange(new Date(), 7, true);
  const [state, setState] = useImmer({
    startDate: start,
    endDate: end,
    selectedTime: { label: LANG('7天'), value: 7 },
  });
  const { startDate, endDate, selectedTime } = state;
  const DATE_OPTIONS = [
    { label: LANG('7天'), tabName: LANG('最近7天'), value: 7 },
    { label: LANG('30天'), tabName: LANG('最近30天'), value: 30 },
    { label: LANG('90天'), tabName: LANG('最近90天'), value: 90 },
  ];
  const onChangeDateMode = (value: { label: string; value: number }[]) => {
    const duration = value[0].value;
    if (duration !== 5) {
      //实际持续天数设置
      const { start = '', end = '' } = getFormatDateRange(new Date(), duration, true);
      setState((draft) => {
        draft.startDate = start;
        draft.endDate = end;
      });
    }
    // onDateRangeChange?.({
    //   startDate: start,
    //   endDate: end,
    // });
    setState((draft) => {
      draft.selectedTime = value[0];
    });
    const indexMap: { [key: number]: number } = {
      7: 0,
      30: 1,
      90: 2,
    };
    onSelectChange?.(value, indexMap[duration]);
  };
  const onChangeDate = useCallback((param: any) => {
    const [start, end] = param || [];
    if (!start || !end) {
      return;
    }
    const formatStartDate = start.format('YYYY-MM-DD H:m:s');
    const formatEndDate = end.format('YYYY-MM-DD H:m:s');
    setState((draft) => {
      draft.startDate = formatStartDate;
      draft.endDate = formatEndDate;
    });
  }, []);
  useEffect(() => {
    onDateRangeChange?.({
      startDate: startDate,
      endDate: endDate,
    });
  }, [startDate, endDate]);
  return (
    <>
      <DesktopOrTablet>
        <Select width={dayOptionWidth} options={DATE_OPTIONS} values={[selectedTime]} onChange={onChangeDateMode} />
        <DateRangePicker
          value={[dayjs(startDate), dayjs(endDate)]}
          placeholder={[LANG('开始日期'), LANG('结束日期')]}
          onChange={onChangeDate}
          allowClear={false}
        />
      </DesktopOrTablet>
      <Mobile>
        <div className="mobile-filter-bar">
          <div className="mobile-quick-times">
            {DATE_OPTIONS.map((item, key) => {
              return (
                <div
                  onClick={() => onChangeDateMode([item])}
                  className={item.value === state.selectedTime.value ? 'active' : ''}
                  key={key}
                >
                  {item.tabName}
                </div>
              );
            })}
          </div> 
        </div>
      </Mobile>
      <style jsx>{styles}</style>
    </>
  );
};

const styles = css`
  .mobile-filter-bar {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
     color: var(--text_2);
    .mobile-quick-times {
      display: flex;
      gap: 16px;
      > div {
        background: var(--fill_3);
        padding: 8px 12px;
        border-radius: 4px;
        border: 1px solid var(--fill_3);
        font-size: 12px;
        &.active {
          color: var(--text_brand);
          border-color: var(--text_brand);
        }
      }
    }
    .mobile-filter {
      display: flex;
      font-size: 12px;
      align-items: center;
      span {
        padding-left: 5px;
      }
    }
  }
`;
