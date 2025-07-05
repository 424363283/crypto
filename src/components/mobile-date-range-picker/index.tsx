import React, { useEffect, useState } from 'react';
import { DatePickerView } from 'antd-mobile';
import dayjs, { Dayjs } from 'dayjs';
import { clsx, styles } from './styled';
import { MobileBottomSheet } from '../mobile-modal';
import { LANG } from '@/core/i18n';
import { BasicInput, INPUT_TYPE } from '../basic-input';
import { Button } from '../button';
import { Size } from '../constants';

interface MobileDateRangePickerProps {
  startTime?: Dayjs;
  endTime?: Dayjs;
  children?: React.ReactNode;
  onDateChange?: (params: Dayjs[]) => void;
}
// 不支持ssr,需要动态导入const MobileDateRangePicker = dynamic(() => import('../mobile-date-range-picker'), { ssr: false })
const MobileDateRangePicker: React.FC<MobileDateRangePickerProps> = ({
  startTime = dayjs().startOf('day'),
  endTime = dayjs().endOf('day'),
  children,
  onDateChange,
}) => {
  const [visible, setVisible] = useState(false);
  const [activeInput, setActiveInput] = useState<'start' | 'end' | null>(null);
  const [localStartTime, setLocalStartTime] = useState<Dayjs>(startTime);
  const [localEndTime, setLocalEndTime] = useState<Dayjs>(endTime);

  const handleStartTimeChange = (value: Date) => {
    const newStartTime = dayjs(value);
    setLocalStartTime(newStartTime);
  };

  const handleEndTimeChange = (value: Date) => {
    const newEndTime = dayjs(value);
    setLocalEndTime(newEndTime);
  };

  useEffect(() => {
    setLocalStartTime(startTime);
    setLocalEndTime(endTime);
  }, [startTime, endTime]);

  return (
    <>
      <div className='pick-input-range'>
        {children ? (
          <div onClick={ () => setVisible(true)}> {children} </div>
        ) : (
          <>
            <BasicInput
              readOnly
              size={Size.LG}
              style={{ textAlign: 'center' }}
              label={''}
              placeholder={''}
              type={INPUT_TYPE.NORMAL_TEXT}
              value={startTime.format('YYYY-MM-DD')}
              onClick={() => {
                setVisible(true);
                setActiveInput('start');
              }}
            />
            <span>{LANG('至')}</span>
            <BasicInput
              readOnly
              size={Size.LG}
              style={{ textAlign: 'center' }}
              label={''}
              placeholder={''}
              type={INPUT_TYPE.NORMAL_TEXT}
              value={endTime.format('YYYY-MM-DD')}
              onClick={() => {
                setVisible(true);
                setActiveInput('end');
              }}
            />
          </>)
        }
      </div>

      <MobileBottomSheet
        title={LANG('选择日期')}
        visible={visible}
        close={() => {
          setVisible(false);
          setLocalStartTime(startTime);
          setLocalEndTime(endTime);
        }}
        hasCancel
        cancelText='取消'
        onCancel={() => {
          setVisible(false);
          setLocalStartTime(startTime);
          setLocalEndTime(endTime);
        }}
        onConfirm={() => {
          setVisible(false);
          if (onDateChange) {
            onDateChange([localStartTime, localEndTime]);
          }
        }}
        content={
          (
            <div className='picker-content'>
              <div className='pick-input-wrapper'>
                <div className='pick-input-title'>
                  {LANG('选择12个月内的时间范围')}
                </div>
                <div className='pick-input-range'>
                  <BasicInput
                    className='pick-input'
                    size={Size.LG}
                    style={{ textAlign: 'center' }}
                    readOnly
                    label={''}
                    placeholder={''}
                    type={INPUT_TYPE.NORMAL_TEXT}
                    value={localStartTime.format('YYYY-MM-DD')}
                    onClick={() => {
                      setActiveInput('start');
                    }}
                  />
                  <span>至</span>
                  <BasicInput
                    className='pick-input'
                    readOnly
                    size={Size.LG}
                    style={{ textAlign: 'center' }}
                    label={''}
                    placeholder={''}
                    type={INPUT_TYPE.NORMAL_TEXT}
                    value={localEndTime.format('YYYY-MM-DD')}
                    onClick={() => {
                      setActiveInput('end');
                    }}
                  />
                </div>
              </div>

              {activeInput === 'start' && (
                <DatePickerView
                  style={{ '--height': '180px' }}
                  value={localStartTime.toDate()}
                  onChange={handleStartTimeChange}
                />
              )}
              {activeInput === 'end' && (
                <DatePickerView
                  style={{ '--height': '180px' }}
                  value={localEndTime.toDate()}
                  onChange={handleEndTimeChange}
                />
              )}
            </div>
          )
        }
      />
      {styles}
    </>
  );
};

export default MobileDateRangePicker;
