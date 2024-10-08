import { clsx, MediaInfo } from '@/core/utils';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';

dayjs.extend(duration);
export const CountDown = (props: { timeStamp: number }) => {
  const { timeStamp } = props;
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const { days, hours, minutes, seconds } = timeRemaining;
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(getRemainingTime(timeStamp));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeStamp]);

  function getRemainingTime(target: number) {
    const now = dayjs().valueOf();
    const remainingTime = target - now;

    if (remainingTime <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const durationObj = dayjs.duration(remainingTime);
    return {
      days: Math.floor(durationObj.asDays()),
      hours: durationObj.hours(),
      minutes: durationObj.minutes(),
      seconds: durationObj.seconds(),
    };
  }
  function formatTime(value: number) {
    return String(value).padStart(2, '0');
  }

  const isTimeExpired = days === 0 && hours === 0 && minutes === 0 && seconds === 0;
  return (
    <div className={clsx('count-down-container', isTimeExpired && 'time-expired')}>
      <div className='time-section'>{formatTime(days)}D</div>
      <div className='dot'>: </div>
      <div className='time-section'>{formatTime(hours)}H</div>
      <div className='dot'>: </div>
      <div className='time-section'>{formatTime(minutes)}M</div>
      <div className='dot'>: </div>
      <div className='time-section'>{formatTime(seconds)}S</div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .count-down-container {
    display: flex;
    align-items: center;
    .time-section {
      font-size: 14px;
      font-weight: 500;
      width: 74px;
      height: 30px;
      border-radius: 5px;
      color: var(--spec-font-special-brand-color);
      background-color: var(--spec-background-color-3);
      display: flex;
      align-items: center;
      justify-content: center;
      @media ${MediaInfo.mobile} {
        width: 60px;
      }
    }
    .dot {
      font-size: 24px;
      color: var(--theme-font-color-1);
      margin: 0px 5px;
    }
  }
  .time-expired {
    .time-section {
      color: var(--spec-font-color-1);
    }
  }
`;